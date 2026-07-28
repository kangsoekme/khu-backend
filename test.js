
import { prismaClient } from './src/application/database.js';
import dashboardService from './src/services/dashboard-service.js';

async function test() {
  try {
    const res = await dashboardService.getSuperAdminDashboard();
    console.log('SUCCESS');
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await prismaClient.$disconnect();
  }
}
test();

