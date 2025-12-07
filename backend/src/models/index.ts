
import { User } from './User';
import { UserProfile } from './UserProfile';
import { Wallet } from './Wallet';
import { Class } from './Class';
import { Booking } from './Booking';
import { TrainingPlan } from './TrainingPlan';
import { SocialPost } from './SocialPost';

// User Associations
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Class, { foreignKey: 'trainerId', as: 'teachingClasses' });
Class.belongsTo(User, { foreignKey: 'trainerId', as: 'trainer' });

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Class.hasMany(Booking, { foreignKey: 'classId', as: 'bookings' });
Booking.belongsTo(Class, { foreignKey: 'classId' });

User.hasMany(TrainingPlan, { foreignKey: 'userId', as: 'plans' });
TrainingPlan.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(SocialPost, { foreignKey: 'userId', as: 'posts' });
SocialPost.belongsTo(User, { foreignKey: 'userId', as: 'author' });

export { User, UserProfile, Wallet, Class, Booking, TrainingPlan, SocialPost };
