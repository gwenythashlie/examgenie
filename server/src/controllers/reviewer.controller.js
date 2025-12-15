const supabase = require('../config/supabase');
const { extractTextFromPDF } = require('../utils/pdfProcessor');

const uploadReviewer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, buffer, mimetype } = req.file;
    const userId = req.user.id;
    const fileName = `${userId}/${Date.now()}_${originalname}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reviewers')
      .upload(fileName, buffer, {
        contentType: mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('reviewers')
      .getPublicUrl(fileName);

    // Extract text from PDF
    let extractedText = '';
    try {
      extractedText = await extractTextFromPDF(buffer);
    } catch (error) {
      console.error('PDF extraction error:', error);
      // Continue even if extraction fails
    }

    // Save reviewer metadata to database
    const { data: reviewer, error: dbError } = await supabase
      .from('reviewers')
      .insert({
        user_id: userId,
        file_name: originalname,
        file_url: publicUrl,
        file_path: fileName,
        extracted_text: extractedText,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Try to delete uploaded file
      await supabase.storage.from('reviewers').remove([fileName]);
      return res.status(500).json({ error: 'Failed to save reviewer' });
    }

    res.status(201).json({
      message: 'Reviewer uploaded successfully',
      reviewer,
    });
  } catch (error) {
    console.error('Upload reviewer error:', error);
    res.status(500).json({ error: 'Failed to process reviewer' });
  }
};

const getReviewers = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('reviewers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ reviewers: data });
  } catch (error) {
    console.error('Get reviewers error:', error);
    res.status(500).json({ error: 'Failed to fetch reviewers' });
  }
};

const getReviewer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('reviewers')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Reviewer not found' });
    }

    res.json({ reviewer: data });
  } catch (error) {
    console.error('Get reviewer error:', error);
    res.status(500).json({ error: 'Failed to fetch reviewer' });
  }
};

const deleteReviewer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get reviewer to find file path
    const { data: reviewer, error: getError } = await supabase
      .from('reviewers')
      .select('file_path')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (getError || !reviewer) {
      return res.status(404).json({ error: 'Reviewer not found' });
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('reviewers')
      .remove([reviewer.file_path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('reviewers')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    res.json({ message: 'Reviewer deleted successfully' });
  } catch (error) {
    console.error('Delete reviewer error:', error);
    res.status(500).json({ error: 'Failed to delete reviewer' });
  }
};

module.exports = {
  uploadReviewer,
  getReviewers,
  getReviewer,
  deleteReviewer,
};