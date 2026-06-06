import { nanoid } from 'nanoid';
import Share from '../models/Share.js';

// POST /api/share
export const createShare = async (req, res) => {
  try {
    const { category, algo, inputData, speed } = req.body;

    if (!category || !algo) {
      return res.status(400).json({
        error: 'category and algo are required'
      });
    }

    const shareId = nanoid(8);

    const share = await Share.create({
      shareId,
      category,
      algo,
      inputData,
      speed,
    });

    res.status(201).json({
      shareId: share.shareId,
      shareUrl: `/share/${share.shareId}`,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/share/:id
export const getShare = async (req, res) => {
  try {
    const share = await Share.findOne({
      shareId: req.params.id
    });

    if (!share) {
      return res.status(404).json({
        error: 'Share not found or expired'
      });
    }

    res.json({
      category:  share.category,
      algo:      share.algo,
      inputData: share.inputData,
      speed:     share.speed,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};