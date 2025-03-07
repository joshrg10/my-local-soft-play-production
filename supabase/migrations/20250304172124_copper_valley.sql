/*
  # Update playground descriptions to support rich text

  This migration adds example rich text content to the descriptions
  of existing playgrounds to demonstrate the formatting capabilities.
  
  1. Updates
    - Updates the description field of existing playgrounds with formatted content
  
  Note: This is a non-destructive migration that only updates content
*/

-- Update Funky Monkeys with HTML content
UPDATE playgrounds
SET description = '<h2>Welcome to Funky Monkeys Play Centre!</h2>
<p>Funky Monkeys is a vibrant indoor play centre designed for children aged 0-12. Our facility features a large multi-level soft play structure with slides, ball pits, and climbing frames.</p>

<h3>Our Facilities Include:</h3>
<ul>
  <li>Large multi-level play frame with slides and obstacles</li>
  <li>Dedicated toddler area for under 4s</li>
  <li>Ball pit zones for all ages</li>
  <li>Comfortable seating for parents</li>
  <li>Free Wi-Fi throughout the venue</li>
</ul>

<h3>Party Packages</h3>
<p>We offer fantastic birthday party packages with private party rooms, food options, and a dedicated party host. Contact us for more information about our party packages and availability.</p>

<h3>Café</h3>
<p>Our on-site café serves a variety of hot and cold drinks, snacks, and meals. Parents can relax and enjoy refreshments while keeping an eye on their children.</p>'
WHERE name = 'Funky Monkeys Play Centre';

-- Update Adventure World with markdown-style content
UPDATE playgrounds
SET description = '## Adventure World - Where Fun Knows No Bounds!

Adventure World is an exciting indoor playground featuring a range of activities for children of all ages. Our main play area includes climbing walls, tube slides, and obstacle courses.

### Play Zones
* Main Adventure Zone (ages 4-14)
* Toddler Town (ages 0-4)
* Gaming Area (ages 8+)
* Sports Zone

### Special Features
* 8m high climbing wall with safety harnesses
* Giant wave slides
* Interactive digital games
* Air hockey and table football

We also offer a separate area for toddlers, a gaming zone for older kids, and a café serving hot and cold food and drinks. Our trained staff ensure a safe and fun environment for all visitors.'
WHERE name = 'Adventure World';

-- Update Jungle Jims with mixed content
UPDATE playgrounds
SET description = 'Jungle Jims is a jungle-themed indoor play centre that offers a safe and fun environment for children to play and explore. Our facility includes a large play frame with slides, rope bridges, and ball cannons.

## Jungle Zones
1. Monkey Madness - climbing frames and rope swings
2. Tiger Territory - slides and tunnels
3. Crocodile Creek - ball pit and water features
4. Tiny Tots - dedicated under 5s area

## Birthday Parties
We offer **amazing birthday packages** with themed decorations, food options, and a dedicated party host. Book early to avoid disappointment!

We also have a dedicated area for under 5s, party rooms for special occasions, and a café serving a variety of refreshments.'
WHERE name = 'Jungle Jims';

-- Update other playgrounds with formatted content
UPDATE playgrounds
SET description = '<h2>Welcome to Tiny Town Play Centre</h2>
<p>Tiny Town is a unique indoor play centre designed as a miniature town where children can engage in role play. Our facility features a mini supermarket, hospital, fire station, and more, allowing children to explore different professions through play.</p>

<h3>Role Play Areas:</h3>
<ul>
  <li>Mini Supermarket with shopping carts and checkout</li>
  <li>Hospital with doctor''s equipment</li>
  <li>Fire Station with dress-up uniforms</li>
  <li>Beauty Salon with play makeup and mirrors</li>
  <li>Construction Zone with building blocks</li>
</ul>

<p>We also have a small soft play area and a café for parents to relax while children play and learn through imagination.</p>'
WHERE name = 'Tiny Town Play Centre';

UPDATE playgrounds
SET description = '## Bounce & Play - The Ultimate Inflatable Adventure

Bounce & Play is an indoor playground featuring a variety of inflatable bouncy castles, slides, and obstacle courses. Perfect for children who love to jump, climb, and slide in a safe environment.

### Our Inflatables Include:
* Giant Bouncy Castle
* Inflatable Obstacle Course
* Mega Slides
* Toddler Bounce Zone
* Ball Pool Pit

### Party Information
We offer **complete party packages** with exclusive use of certain areas, food options, and a dedicated party host. Contact us for more information about our party packages and availability.

We also have a dedicated toddler area with smaller inflatables, a café serving snacks and drinks, and party packages for birthdays and special events.'
WHERE name = 'Bounce & Play';

UPDATE playgrounds
SET description = '<h2>Kids Kingdom - A World of Play</h2>

<p>Kids Kingdom is a large indoor play centre with something for everyone. Our main play area features slides, ball pits, and climbing frames, while our sports zone offers football and basketball.</p>

<h3>Play Areas:</h3>
<ol>
  <li>Adventure Play Frame - multi-level with slides and obstacles</li>
  <li>Sports Zone - football and basketball</li>
  <li>Toddler Village - safe area for under 3s</li>
  <li>Ball Cannon Arena - interactive ball blasters</li>
</ol>

<h3>Food & Drink</h3>
<p>Our café serves a range of hot and cold food, drinks, and snacks. We cater to various dietary requirements - just ask our friendly staff.</p>

<p>We also have a dedicated area for under 3s, party rooms, and a café serving hot and cold food.</p>'
WHERE name = 'Kids Kingdom';