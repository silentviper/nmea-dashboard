import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Route Components
const Home = () => import('../views/Home.vue');
const Settings = () => import('../views/Settings.vue');
const SystemStatus = () => import('../views/SystemStatus.vue');

export const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'home',
		component: Home,
		meta: {
			title: 'Dashboard',
		},
	},
	{
		path: '/settings',
		name: 'settings',
		component: Settings,
		meta: {
			title: 'Settings',
		},
	},
	{
		path: '/system',
		name: 'system',
		component: SystemStatus,
		meta: {
			title: 'System Status',
		},
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'not-found',
		component: () => import('../views/NotFound.vue'),
		meta: {
			title: 'Page Not Found',
		},
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		}
		return { top: 0 };
	},
});

// Navigation Guards
router.beforeEach((to, from, next) => {
	// Update page title
	document.title = `${to.meta.title} - NMEA Dashboard` || 'NMEA Dashboard';
	next();
});

export default router;
