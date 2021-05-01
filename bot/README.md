<h1 align="center">SherBot</h1>
<blockquote align="center">
  <em>SherBot</em> a lightweight Discord bot that can be used to create any bot! It has all the boilerplate code done for you, and is fully modular! You can add commands, events, and timed tasks - all fully modular!
</blockquote>

<h2>
Requirements
</h2>
<ul>
  <li> Node.js </li>
  <li> js-logger </li>
  <li> discord.js </li>
</ul>

<h2>Usage</h2>
<h3>
Commands
</h3>
This folder stores commands (duh). Any files that end with ".js" in the commands folder will be registered as slash commands by the bot. Follow the template given in the "example.js" file.

<h3>
Events
</h3>
This folder stores the logic for an event. Any files that end with ".js" in the events folder will be registered as on or once events to the Discord API. Follow the template given in the "example.js" file.

<h3>
Tasks
</h3>
This folder stores functions. Any files that end with ".js" in the tasks folder will be registered as functions to be executed at certain intervals. Follow the template given in the "example.js" file.

<h3>
Embeds
</h3>
This folder is used to store embeds in their own files to allow cleaner code. These can be imported in files and used as neccessary.