// USERS
export const MOCK_USERS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://picsum.photos/id/1011/100/100', status: 'Active', plan: 'Premium', channel: 'LinkedIn', mobile: '+1 555-0101', joinedDate: '2023-10-01' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://picsum.photos/id/1012/100/100', status: 'Inactive', plan: 'Standard', channel: 'Direct', mobile: '+1 555-0102', joinedDate: '2023-09-15' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', avatar: 'https://picsum.photos/id/1005/100/100', status: 'Active', plan: 'Free', channel: 'Referral', mobile: '+1 555-0103', joinedDate: '2023-11-20' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', avatar: 'https://picsum.photos/id/1027/100/100', status: 'Active', plan: 'Premium', channel: 'Event', mobile: '+1 555-0104', joinedDate: '2023-12-05' },
  { id: '5', name: 'Evan Wright', email: 'evan@example.com', avatar: 'https://picsum.photos/id/1025/100/100', status: 'Pending', plan: 'Standard', channel: 'Web', mobile: '+1 555-0105', joinedDate: '2024-01-10' },

  // extra 45 generated users
  ...Array.from({ length: 45 }).map((_, i) => ({
    id: (i + 6).toString(),
    name: `User ${i + 6}`,
    email: `user${i + 6}@example.com`,
    avatar: `https://picsum.photos/id/${(i % 50) + 100}/100/100`,
    status: ['Active', 'Inactive', 'Pending'][i % 3],
    plan: ['Premium', 'Standard', 'Free'][i % 3],
    channel: ['LinkedIn', 'Direct', 'Web', 'Referral'][i % 4],
    mobile: `+1 555-01${(i + 10).toString().padStart(2, '0')}`,
    joinedDate: '2024-02-01'
  }))
];


// CHAPTERS
export const MOCK_CHAPTERS = [
  { id: '1', title: 'Silicon Valley Founders', location: 'San Francisco, CA', members: 1240, status: 'Active', joinsToday: 12, icon: '🚀' },
  { id: '2', title: 'NYC Tech Meetup', location: 'New York, NY', members: 890, status: 'Active', joinsToday: 5, icon: '🗽' },
  { id: '3', title: 'London Innovators', location: 'London, UK', members: 650, status: 'Inactive', joinsToday: 0, icon: '💂' },
  { id: '4', title: 'Berlin Blockchain', location: 'Berlin, DE', members: 420, status: 'Active', joinsToday: 8, icon: '🍺' },
];


// ROLES
export const MOCK_ROLES = [
  { id: '1', name: 'Super Admin', usersCount: 2, description: 'Full access to all modules and system settings.', permissions: {} },
  { id: '2', name: 'Community Manager', usersCount: 5, description: 'Can manage users, events, and chapters.', permissions: {} },
  { id: '3', name: 'Moderator', usersCount: 12, description: 'Can view and moderate user content.', permissions: {} },
];


// INQUIRIES
export const MOCK_INQUIRIES = [
  { id: '101', name: 'Sarah Connor', email: 'sarah@sky.net', phone: '+1 202-555-0188', message: 'Interested in sponsoring the next event.', status: 'New', priority: 'High', assignedTo: 'Alice', date: '2h ago' },
  { id: '102', name: 'Kyle Reese', email: 'kyle@resistance.org', phone: '+1 202-555-0199', message: 'Having trouble logging into the chapter portal.', status: 'In Progress', priority: 'Medium', assignedTo: 'Bob', date: '5h ago' },
  { id: '103', name: 'John Doe', email: 'john@doe.com', phone: '+1 202-555-0100', message: 'Where can I find the invoice?', status: 'Closed', priority: 'Low', assignedTo: 'Alice', date: '1d ago' },
];


// LEADS
export const MOCK_LEADS = [
  { id: 'l1', name: 'TechCorp Solutions', company: 'TechCorp', email: 'contact@techcorp.com', phone: '555-0001', stage: 'New Lead', value: 5000, tags: ['Hot', 'Enterprise'], lastActivity: '10m ago', assignedToAvatar: 'https://picsum.photos/id/1011/50/50' },
  { id: 'l2', name: 'Innovate LLC', company: 'Innovate', email: 'info@innovate.com', phone: '555-0002', stage: 'Contacted', value: 2500, tags: ['Warm'], lastActivity: '2h ago', assignedToAvatar: 'https://picsum.photos/id/1012/50/50' },
  { id: 'l3', name: 'StartUp Inc', company: 'StartUp', email: 'hello@startup.com', phone: '555-0003', stage: 'In Discussion', value: 12000, tags: ['Hot'], lastActivity: '1d ago', assignedToAvatar: 'https://picsum.photos/id/1005/50/50' },
  { id: 'l4', name: 'Global Media', company: 'Global', email: 'press@global.com', phone: '555-0004', stage: 'Documentation', value: 8500, tags: ['Cold'], lastActivity: '3d ago', assignedToAvatar: 'https://picsum.photos/id/1027/50/50' },
  { id: 'l5', name: 'NextGen Systems', company: 'NextGen', email: 'sales@nextgen.com', phone: '555-0005', stage: 'Won', value: 20000, tags: ['Enterprise'], lastActivity: '1w ago', assignedToAvatar: 'https://picsum.photos/id/1025/50/50' },
];


// DASHBOARD STATS
export const DASHBOARD_STATS = [
  { title: 'Total Members', value: '12,450', trend: '+12%', icon: 'users', color: 'blue' },
  { title: 'Active Chapters', value: '45', trend: '+3', icon: 'map-pin', color: 'green' },
  { title: 'Events Scheduled', value: '8', trend: 'Next: Fri', icon: 'calendar', color: 'purple' },
  { title: 'Pipeline Value', value: '$48k', trend: '+5%', icon: 'dollar-sign', color: 'yellow' },
];


// GROWTH CHART
export const GROWTH_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 7500 },
];


// BAR CHART DATA
export const CHAPTER_DATA = [
  { name: 'SF', value: 2400 },
  { name: 'NYC', value: 1398 },
  { name: 'LDN', value: 9800 },
  { name: 'BER', value: 3908 },
];


// PIE CHART
export const LEAD_DATA = [
  { name: 'Won', value: 400 },
  { name: 'Lost', value: 300 },
  { name: 'In Progress', value: 300 },
  { name: 'New', value: 200 },
];
