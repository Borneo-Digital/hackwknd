// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Check if we have any hackathons
    const hackathonsCount = await strapi.entityService.count('api::hackathon.hackathon');
    
    // Only create sample data if no hackathons exist
    if (hackathonsCount === 0) {
      console.log('Creating sample hackathon data...');
      
      // Create sample hackathon
      await strapi.entityService.create('api::hackathon.hackathon', {
        data: {
          Title: 'Hackathon Weekend 2025',
          Theme: 'Building for the Future',
          Date: new Date('2025-04-15'),
          Location: 'Sarawak Digital Campus',
          Description: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'Join us for an exciting weekend of innovation, coding, and collaboration at Hackathon Weekend 2025!' }
              ]
            },
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'About the Event: Hackathon Weekend is Sarawak\'s premier hackathon, bringing together the brightest minds to solve challenging problems and create innovative solutions.' }
              ]
            },
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: 'What to Expect:' }
              ]
            },
            {
              type: 'bullet-list',
              children: [
                {
                  type: 'list-item',
                  children: [{ type: 'text', text: '48 hours of intensive coding and problem-solving' }]
                },
                {
                  type: 'list-item',
                  children: [{ type: 'text', text: 'Mentoring from industry experts' }]
                },
                {
                  type: 'list-item',
                  children: [{ type: 'text', text: 'Networking opportunities with tech professionals' }]
                },
                {
                  type: 'list-item',
                  children: [{ type: 'text', text: 'Amazing prizes for the winning teams' }]
                }
              ]
            }
          ],
          slug: 'hackathon-weekend-2025',
          EventStatus: new Date('2025-04-15'), // Store as date but will be converted to status string in frontend
          RegistrationEndDate: new Date('2025-04-01'),
          publishedAt: new Date(),
          Schedule: {
            schedule: [
              {
                day: 'Day 1',
                date: 'April 15, 2025',
                events: [
                  { time: '9:00 AM', event: 'Registration', description: 'Check-in and get your badge' },
                  { time: '10:00 AM', event: 'Opening Ceremony', description: 'Welcome address and rules explanation' },
                  { time: '12:00 PM', event: 'Lunch', description: 'Networking lunch' },
                  { time: '1:00 PM', event: 'Hacking Begins', description: 'Start coding!' }
                ]
              },
              {
                day: 'Day 2',
                date: 'April 16, 2025',
                events: [
                  { time: '9:00 AM', event: 'Morning Check-in', description: 'Daily progress update' },
                  { time: '12:00 PM', event: 'Lunch', description: 'Networking lunch' },
                  { time: '2:00 PM', event: 'Mentoring Sessions', description: 'Get help from industry experts' },
                  { time: '6:00 PM', event: 'Dinner', description: 'Evening meal' }
                ]
              }
            ]
          },
          Prizes: {
            prizes: {
              first: { rank: '1st Place', amount: 5000, description: 'Grand Prize', icon: 'trophy' },
              second: { rank: '2nd Place', amount: 3000, description: 'Runner-up', icon: 'medal' },
              third: { rank: '3rd Place', amount: 1500, description: 'Third Place', icon: 'award' },
              special: {
                llm: { rank: 'Best AI Use', amount: 1000, description: 'Best use of LLM technology', icon: 'ai' },
                accessibility: { rank: 'Accessibility', amount: 1000, description: 'Best accessible solution', icon: 'accessibility' },
                peoples_choice: { rank: 'People\'s Choice', amount: 1000, description: 'Voted by attendees', icon: 'heart' }
              }
            }
          },
          FAQ: [
            {
              question: "Who can participate?",
              answer: "Anyone with an interest in technology and innovation! Whether you're a student, professional, or tech enthusiast, all are welcome."
            },
            {
              question: "Do I need to bring my own computer?",
              answer: "Yes, all participants should bring their own laptops and any other equipment they may need."
            },
            {
              question: "Is there a registration fee?",
              answer: "No, participation is completely free! We provide the venue, food, and Wi-Fi."
            },
            {
              question: "How are teams formed?",
              answer: "You can register as a team of 3-5 members or as an individual. We'll help individuals form teams at the beginning of the event."
            }
          ]
        }
      });
      
      console.log('Sample hackathon created successfully!');
    }
  },
};
