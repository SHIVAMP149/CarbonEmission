import User from '../models/User.js';

export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      name: user.name,
      email: user.email,
      ecoScore: user.ecoScore,
      carbonEmissions: user.carbonEmissions,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ carbonEmissions: 1 }).limit(10); // lower is better
    const currentUser = await User.findById(req.user._id);

    const rank = await User.countDocuments({ carbonEmissions: { $lt: currentUser.carbonEmissions } }) + 1;

    res.json({ topUsers: users, currentRank: rank });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};


// Simplified emission factors
const factors = {
  transport: { car: 0.21, bike: 0.05, bus: 0.11 },
  energy: { electricity: 0.5, gas: 2.3 },
  food: { vegetarian: 1.5, nonVeg: 3.5 }
};

export const calculateFootprint = async (req, res) => {
  const { transport, energy, food } = req.body;

  try {
    // Calculate emissions
    const transportEmission = transport.km * (factors.transport[transport.mode] || 0);
    const energyEmission = energy.electricity * factors.energy.electricity + energy.gas * factors.energy.gas;
    const foodEmission = factors.food[food.type] || 2;

    const totalEmission = +(transportEmission + energyEmission + foodEmission).toFixed(2);

    // AI Suggestion (mocked for now)
    const tips = [];

    if (transport.mode === 'car') tips.push("Consider using public transport or carpooling.");
    if (food.type === 'nonVeg') tips.push("Try eating plant-based meals twice a week.");
    if (energy.electricity > 10) tips.push("Turn off unused electronics and switch to LED lights.");

    // Optionally: Update user stats
    const user = await User.findById(req.user._id);
    user.carbonEmissions += totalEmission;
    user.ecoScore += Math.max(0, 50 - totalEmission);
    await user.save();

    res.json({
      totalEmission,
      tips,
      newEcoScore: user.ecoScore
    });

  } catch (err) {
    res.status(500).json({ message: 'Calculation failed' });
  }
};
