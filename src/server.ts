import app from './app';
import {sequelize} from './models';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        // En dev podrías usar sync({ force: true }) para reset DB; en prod NO
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Unable to start server:', err);
    }
})();