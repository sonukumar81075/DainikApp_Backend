const Report = require('../models/Report');

const asyncHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const buildImageUrl = (req) => {
  if (req.file) {
    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  return req.body.image || '';
};

exports.createReport = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const image = buildImageUrl(req);

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const report = await Report.create({ title, description, image });
  res.status(201).json(report);
});

exports.getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
});

exports.getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }
  res.json(report);
});

exports.updateReport = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const image = buildImageUrl(req);
  const payload = { title, description };
  if (image) payload.image = image;

  const updated = await Report.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!updated) {
    return res.status(404).json({ message: 'Report not found' });
  }

  res.json(updated);
});

exports.deleteReport = asyncHandler(async (req, res) => {
  const deleted = await Report.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Report not found' });
  }
  res.json({ message: 'Report deleted' });
});

exports.seedReports = async () => {
  const count = await Report.countDocuments();
  if (count > 0) return;

  const sample = [
    {
      title: 'Monsoon sweeps across the plains',
      description:
        'Heavy showers brought relief from the heatwave as the southwest monsoon reached the northern plains. Farmers welcomed the rains ahead of the kharif sowing season.',
      image:
        'https://images.unsplash.com/photo-1508695666093-1d5e2effe499?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Startup hub sees record funding',
      description:
        'Tier-2 cities emerged as unexpected hotspots with local startups raising fresh capital for clean energy, logistics, and agri-tech solutions.',
      image:
        'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Metro rail expands new corridor',
      description:
        'The new metro corridor promises to cut commute times by half, connecting key business districts with residential suburbs via green-powered trains.',
      image:
        'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  await Report.insertMany(sample); 
};

