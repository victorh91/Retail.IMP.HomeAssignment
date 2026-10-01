# Weather Dashboard Take-Home Test

## Instructions

In the interest of time a simple application has been created. Please follow the below instructions to modify and enhance this base application.

The React Router has already been set up for you. Here what is includes:

* `/home`: A page that displays the text “Open Dashboard” (nothing more).
* `/dashboard`: A page that shows the weather dashboard.

Please modify the base application with the below requirements. Be creative, feel free to change any part of the base application in any way desired to complete the task.

1. **Weather Data:**
   * Modify `mocks.handlers` to include at least 90 consecutive days of randomized weather history data. Can be completely dynamic if desired.
   * The current/forecast weather data can remain static.
2. **MSW Weather API Consumer:**
   * Write a production-level consumer for the MSW Weather API provided.
3. **Date Picker:**
   * Add a date picker component to the top right corner of the dashboard.
   * Changes in the date picker should trigger fetching data for the selected date.
4. **Weather Components (the base app uses [Nivo](https://nivo.rocks) for charts, find references there for inspiration implementing these components):**
   * Create a component that displays the current and forecast weather data.
   * Create another component that utilizes the weather data history. Comparing low vs high temperatures
5. **Styling:**
   * While important, we understand styling things perfectly takes a lot of time and effort, so as long as we can tell what is there, we are happy :).

## Tech Stack

* React 19 + TypeScript, built with Vite
* React Router 7
* Tailwind CSS 4 (configured in `src/index.css`)
* Nivo for charts
* MSW (Mock Service Worker) for the mocked Weather API

## Setup & Running

`nvm` to install Node.js >= 22.12
`npm install`
`npm run dev`

## Discussion topics during the interview

* Forward references
* Context
* State Management
* API Consumption from a React Application
* API Design
* Accessibility
* Virtualisation
* Knowledge of Ecosystem
* Build System
* Authentication
* Permissions
* User Experience
