const express = require('express');
const multer = require('multer');
const supabase = require('../config/supabase');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const BUCKET = 'reviewers';

const ensureBucket = async () => {
  const { data, error } = await supabase.storage.getBucket(BUCKET);
  if (data) return true;
  if (error && error.message && !error.message.includes('not found')) return false;
  const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: true });
  return !createError;
};

router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('reviewers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch reviewers', detail: error.message, hint: 'Ensure table "reviewers" exists.' });
  }

  return res.json({ reviewers: data || [] });
});

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const userId = req.user?.id || 'anonymous';

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const bucketReady = await ensureBucket();
  if (!bucketReady) {
    return res.status(500).json({ error: 'Failed to ensure storage bucket "reviewers"' });
  }

  const filePath = `${userId}/${Date.now()}_${file.originalname}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });

  if (uploadError) {
    return res.status(500).json({ error: 'Upload failed', detail: uploadError.message });
  }

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  const { data: inserted, error: insertError } = await supabase
    .from('reviewers')
    .insert({
      user_id: userId,
      file_name: file.originalname,
      file_url: publicData?.publicUrl || '',
      file_path: filePath,
    })
    .select()
    .single();

  if (insertError) {
    return res.status(500).json({ error: 'Failed to save reviewer metadata', detail: insertError.message, hint: 'Ensure table "reviewers" exists with columns (user_id, file_name, file_url, file_path)' });
  }

  return res.status(201).json({ reviewer: inserted });
});

module.exports = router;
