# nodejs-hotels-data-merge

A Node.js application that works as a web server will focus on data cleaning and selection, adhering to predefined rules aimed at ensuring optimal data quality and sanitation post-merger.

### Features

- Expose API endpoint which allow to query the hotels data with some simple filtering parameters: destination, hotels
- When requested, the server will fetch the results filtered in either option:
  - hotels: based on a list of hotel IDs given
  - destination: based on a given destination ID
- Each hotel should be returned only once

### Response

Response should be returned in an organised format. An example is shown below.

```
[
  {
    "id": "iJhz",
    "destination_id": 5432,
    "name": "Beach Villas Singapore",
    "location": {
      "lat": 1.264751,
      "lng": 103.824006,
      "address": "8 Sentosa Gateway, Beach Villas, 098269",
      "city": "Singapore",
      "country": "Singapore"
    },
    "description": "Surrounded by tropical gardens, these upscale villas in elegant Colonial-style buildings are part of the Resorts World Sentosa complex and a 2-minute walk from the Waterfront train station. Featuring sundecks and pool, garden or sea views, the plush 1- to 3-bedroom villas offer free Wi-Fi and flat-screens, as well as free-standing baths, minibars, and tea and coffeemaking facilities. Upgraded villas add private pools, fridges and microwaves; some have wine cellars. A 4-bedroom unit offers a kitchen and a living room. There's 24-hour room and butler service. Amenities include posh restaurant, plus an outdoor pool, a hot tub, and free parking.",
    "amenities": {
      "general": ["outdoor pool", "indoor pool", "business center", "childcare", "wifi", "dry cleaning", "breakfast"],
      "room": ["aircon", "tv", "coffee machine", "kettle", "hair dryer", "iron", "bathtub"]
    },
    "images": {
      "rooms": [
        { "link": "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/2.jpg", "description": "Double room" },
        { "link": "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/3.jpg", "description": "Double room" },
        { "link": "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/4.jpg", "description": "Bathroom" }
      ],
      "site": [
        { "link": "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/1.jpg", "description": "Front" }
      ],
      "amenities": [
        { "link": "https://d2ey9sqrvkqdfs.cloudfront.net/0qZF/0.jpg", "description": "RWS" }
      ]
    },
    "booking_conditions": [
      "All children are welcome. One child under 12 years stays free of charge when using existing beds. One child under 2 years stays free of charge in a child's cot/crib. One child under 4 years stays free of charge when using existing beds. One older child or adult is charged SGD 82.39 per person per night in an extra bed. The maximum number of children's cots/cribs in a room is 1. There is no capacity for extra beds in the room.",
      "Pets are not allowed.",
      "WiFi is available in all areas and is free of charge.",
      "Free private parking is possible on site (reservation is not needed).",
      "Guests are required to show a photo identification and credit card upon check-in. Please note that all Special Requests are subject to availability and additional charges may apply. Payment before arrival via bank transfer is required. The property will contact you after you book to provide instructions. Please note that the full amount of the reservation is due before arrival. Resorts World Sentosa will send a confirmation with detailed payment information. After full payment is taken, the property's details, including the address and where to collect keys, will be emailed to you. Bag checks will be conducted prior to entry to Adventure Cove Waterpark. === Upon check-in, guests will be provided with complimentary Sentosa Pass (monorail) to enjoy unlimited transportation between Sentosa Island and Harbour Front (VivoCity). === Prepayment for non refundable bookings will be charged by RWS Call Centre. === All guests can enjoy complimentary parking during their stay, limited to one exit from the hotel per day. === Room reservation charges will be charged upon check-in. Credit card provided upon reservation is for guarantee purpose. === For reservations made with inclusive breakfast, please note that breakfast is applicable only for number of adults paid in the room rate. Any children or additional adults are charged separately for breakfast and are to paid directly to the hotel."
    ]
  }
]
```

### Resources

- There are 3 suppliers, each of them has different url:
  - https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme
  - https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia
  - https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies

### Usage

#### Installation

To install the dependencies, run the following command:

```
npm install
```

#### Configuration

Before starting the application, make sure to set up the necessary environment variables. You can do this by creating a `.env` file and filling in the required values.

#### Starting the Server

- To start the server, run the following command:

  ```
  npm start
  ```

- The server will be accessible at http://localhost:3000.

#### Running Tests

To run the tests, use the following command:

```
npm test
```

#### Invoke API

- Example of querying all merged hotels information:

  ```
  localhost:3000/api/hotels
  ```

- Example of querying merged hotels filter by a destination ID:

  ```
  localhost:3000/api/hotels?destination=5432
  ```

- Example of querying merged hotels filter by a list of hotel IDs:

  ```
  localhost:3000/api/hotels?hotels=iJhz,SjyX
  ```

- Example of querying merged hotels filter by a destination ID and list of hotel IDs:

  ```
  localhost:3000/api/hotels?hotels=iJhz,SjyX&destination=5432
  ```

### CI/CD pipelines with GitHub Actions

- This repository supports Continuous Integration and Continuous Deployment (CI/CD) workflows using GitHub Actions along with self-hosted deployment leveraging PM2.

- Self-Hosted Deployment with PM2: Take control of your deployment environment by leveraging PM2 for self-hosted deployment, providing flexibility and scalability.

### A. Self-Hosted

#### 1. PM2 Process Manager

PM2 (Process Manager 2) is a popular process manager for Node.js applications. It provides a set of features to manage, monitor, and keep Node.js applications running smoothly in production environments.

- ##### Install PM2:

  ```
  npm install -g pm2
  ```

- ##### To start application:

  ```
  pm2 start --name=nodejs-hotels-data-merge index.js
  ```

  ![alt text](<[PM2] Done.png>)

- ##### To terminate application:

  ```
  pm2 list

  pm2 delete [app name | id]
  ```

#### 2. Add a new self-hosted runner

Adding a self-hosted runner requires that you download, configure, and execute the GitHub Actions Runner:

- ##### 2.1. Download

  - ###### macOS x64

    ```
    # Create a folder
    mkdir actions-runner && cd actions-runner
    # Download the latest runner package
    $ curl -o actions-runner-osx-x64-2.313.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.313.0/actions-runner-osx-x64-2.313.0.tar.gz
    # Optional: Validate the hash
    $ echo "65dd2618b5afa5ae1394388b215da0b763d791b480ae09f0ead956e8f8864c83  actions-runner-osx-x64-2.313.0.tar.gz" | shasum -a 256 -c
    # Extract the installer
    $ tar xzf ./actions-runner-osx-x64-2.313.0.tar.gz
    ```

  - ###### macOS ARM64

    ```
    # Create a folder
    $ mkdir actions-runner && cd actions-runner
    # Download the latest runner package
    $ curl -o actions-runner-osx-arm64-2.313.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.313.0/actions-runner-osx-arm64-2.313.0.tar.gz
    # Optional: Validate the hash
    $ echo "97258c75cf500f701f8549289c85d885a9497f7886c102bf4857eed8764a9143  actions-runner-osx-arm64-2.313.0.tar.gz" | shasum -a 256 -c
    # Extract the installer
    $ tar xzf ./actions-runner-osx-arm64-2.313.0.tar.gz
    ```

  - ###### Linux x64

    ```
    # Create a folder
    $ mkdir actions-runner && cd actions-runner
    # Download the latest runner package
    $ curl -o actions-runner-linux-x64-2.313.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.313.0/actions-runner-linux-x64-2.313.0.tar.gz
    # Optional: Validate the hash
    $ echo "56910d6628b41f99d9a1c5fe9df54981ad5d8c9e42fc14899dcc177e222e71c4  actions-runner-linux-x64-2.313.0.tar.gz" | shasum -a 256 -c
    # Extract the installer
    $ tar xzf ./actions-runner-linux-x64-2.313.0.tar.gz
    ```

  - ###### Linux ARM64

    ```
    # Create a folder
    $ mkdir actions-runner && cd actions-runner
    # Download the latest runner package
    $ curl -o actions-runner-linux-arm64-2.313.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.313.0/actions-runner-linux-arm64-2.313.0.tar.gz
    # Optional: Validate the hash
    $ echo "44c306066a32c8df8b30b1258b19ed3437285baa4a1d6289f22cf38eca474603  actions-runner-linux-arm64-2.313.0.tar.gz" | shasum -a 256 -c
    # Extract the installer
    $ tar xzf ./actions-runner-linux-arm64-2.313.0.tar.gz
    ```

  - ###### Windows x64

    ```
    # Create a folder under the drive root
    $ mkdir actions-runner; cd actions-runner
    # Download the latest runner package
    $ Invoke-WebRequest -Uri https://github.com/actions/runner/releases/download/v2.313.0/actions-runner-win-x64-2.313.0.zip -OutFile actions-runner-win-x64-2.313.0.zip
    # Optional: Validate the hash
    $ if((Get-FileHash -Path actions-runner-win-x64-2.313.0.zip -Algorithm SHA256).Hash.ToUpper() -ne 'c4cb3e5d9f0ab42ddc224cfdf9fb705397a7b20fd321536da5500259225fdf8a'.ToUpper()){ throw 'Computed checksum did not match' }
    # Extract the installer
    $ Add-Type -AssemblyName System.IO.Compression.FileSystem ; [System.IO.Compression.ZipFile]::ExtractToDirectory("$PWD/actions-runner-win-x64-2.313.0.zip", "$PWD")
    ```

  - ###### Windows ARM64

    ```
    # Create a folder under the drive root
    $ mkdir actions-runner; cd actions-runner
    # Download the latest runner package
    $ Invoke-WebRequest -Uri https://github.com/actions/runner/releases/download/v2.313.0/actions-runner-win-arm64-2.313.0.zip -OutFile actions-runner-win-arm64-2.313.0.zip
    # Optional: Validate the hash
    $ if((Get-FileHash -Path actions-runner-win-arm64-2.313.0.zip -Algorithm SHA256).Hash.ToUpper() -ne '907796520d58527d0c0d0f7d85c1dd3a55146740aa21695cfa2e484223a6ed67'.ToUpper()){ throw 'Computed checksum did not match' }
    # Extract the installer
    $ Add-Type -AssemblyName System.IO.Compression.FileSystem ; [System.IO.Compression.ZipFile]::ExtractToDirectory("$PWD/actions-runner-win-arm64-2.313.0.zip", "$PWD")
    ```

- ##### 2.2. Configure

  - ###### macOS, Linux

    ```
    # Create the runner and start the configuration experience
    $ ./config.sh --url https://github.com/HuyTon/nodejs-hotels-data-merge --token AHDS2KUJBDWG2IL2H53JHYTF2CMYW
    # Last step, run it!
    $ ./run.sh
    ```

  - ###### Windows

    ```
    # Create the runner and start the configuration experience
    $ ./config.cmd --url https://github.com/HuyTon/nodejs-hotels-data-merge --token AHDS2KUJBDWG2IL2H53JHYTF2CMYW
    # Run it!
    $ ./run.cmd
    ```

- ##### 2.3. Start Actions Runner

  ```
  actions-runner $ ./run.sh
  ```

### B. Deploy to Heroku

Before deploying to Heroku, you need to ensure that you have your own Heroku account at https://signup.heroku.com/
And make some changes at file .github/workflows/main.yml:

```
# Change runs-on of job build to 'ubuntu-latest' instead 'self-hosted'
runs-on: ubuntu-latest

# Add the deployment segment and replace the Heroku information with your Heroku credentials
deploy:
    runs-on: ubuntu-latest
    needs: [build]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "[app name]"
          heroku_email: "[email]"
```

#### Trigger the CI/CD pipeline and deployment process

1. Clone this repository to your local machine.
2. Follow the setup instructions provided in the README to configure the CI/CD workflow and self-hosted deployment with PM2.
3. Make changes to your code and push them to trigger the CI/CD pipelines and deployment process.
4. Sit back and watch as GitHub Actions and PM2 handle the rest, automating your development workflow seamlessly.
