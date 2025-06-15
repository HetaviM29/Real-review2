# 🏘️ Real Review

**Real Review** is a community-driven real estate web app where users can upload photos of localities, share personal experiences, and post detailed reviews of places. Ideal for home seekers, travelers, and urban explorers! 
➡️ Live App: To explore the live version, visit http://13.51.159.68/
> 🔀 **Note:** Active development is happening on the [`feature/image-upload`](https://github.com/your-username/real-review/tree/feature/image-upload) branch.  
> Please switch to that branch to view the latest features and updates.

---

## 🌟 Key Features

- 📸 **Image Upload**: Upload photos with name, location, and uploader info.
- 🗺️ **Gallery View**: Browse through a visual map of all uploaded places.
- ✍️ **Reviews**: Share your opinion and read reviews from other users.
- 📥 **Download Support**: Save images locally for offline access.
- 💻 **Responsive Design**: Clean and mobile-friendly UI using **Bootstrap**.

---

## 🧰 Tech Stack

| Layer       | Technology Used                     |
|-------------|--------------------------------------|
| Backend     | Node.js, Express.js                  |
| Frontend    | EJS templates, Bootstrap             |
| Database    | MongoDB (images), AWS DynamoDB (reviews) |
| Storage     | AWS S3 (image files)                 |
| File Upload | Multer, Multer-S3                    |

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js & npm
- MongoDB (local or cloud)
- AWS account with:
  - S3 bucket
  - DynamoDB table

---

### 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd real-review
---
2.Install dependencies:
```bash
    npm install
```
---
3. Configure environment variables:
Create a .env file in the root folder:
```bash
  MONGODB_URI=your_mongodb_connection_string
  AWS_REGION=your_aws_region
  AWS_S3_BUCKET=your_s3_bucket_name
  AWS_ACCESS_KEY_ID=your_aws_access_key
  AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```
---
4.Run the application:
```bash
    node app.js
```
---
5. Visit in browser:
Open http://localhost:3000
---
6. 🎯 Usage Guide
       
    Upload a Place: Submit a photo with name, location & your name.
    
    Add a Review: Open any place from the gallery and add your feedback.
    
    Download Image: Click the 📥 button to save any image.
---
👩‍💻 Made with ❤️ by Real Estate Explorers
---
Let me know your GitHub repo URL if you'd like me to insert a live branch link or any contributor badge.
