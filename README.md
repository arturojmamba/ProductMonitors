# ProductMonitors
Product monitors, get notified on discord

# Product Monitors (Node.js)

This is a collection of product monitors implemented in Node.js. These monitors allow users to track the prices and availability of various products from different online retailers. By utilizing web scraping techniques, the monitors fetch and analyze product data to provide real-time updates and notifications.

## Features

- Multiple retailer support: The monitors are designed to work with different online retailers, allowing users to track products from various sources.
- Product tracking: Users can add specific products to be monitored by providing the product URL or unique identifier.
- Price and availability updates: The monitors regularly fetch the latest product data and provide updates on availability status.
- Notification system: Users can set up notifications to receive alerts when a tracked product's price drops or when it becomes available on discord.
- Customizable settings: Users can configure various settings such as notification preferences, update intervals.

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/arturojmamba/ProductMonitors.git
   ```

2. Navigate to the project directory:

   ```
   cd ProductMonitors
   ```

3. Install the required dependencies:

   ```
   npm install
   ```

4. Set up the configuration:

   - Configure the retailers and their corresponding scraping methods.
   - Customize the notification settings according to your preferences.

5. Run the monitors:

   ```
   node 1-... 2-... 3-...
   ```

## Usage

1. Add a new product to be monitored by providing the product URL or unique identifier.
2. The monitors will regularly fetch the latest data for the tracked products.
3. Receive notifications when the price of a tracked product drops or when it becomes available.
4. Customize the monitoring settings and notification preferences as needed.

## Technologies Used

- Node.js: The JavaScript runtime used for building the product monitors.
- Puppeteer: A Node.js library used for web scraping and automating browser interactions.
- DiscordAPI: A module for sending notifications.
- Cron: A time-based job scheduler for triggering periodic monitor updates.

## Contributing

Contributions are welcome! If you have any ideas, bug fixes, or improvements, feel free to open an issue or submit a pull request.

## Contact

For any questions or inquiries, please contact:

Your Name
Email: arturo.j.mamba@gmail.com

Happy tracking with your product monitors!
