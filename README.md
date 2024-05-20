<h1 align="center">
  🤖 Prompt Engineers AI - LLM Server 
</h1>

<p align="center">
Full LLM REST API with prompts, LLMs, Vector Databases, and Agents
</p>

<p align="center">
  <a href="https://promptengineers-ai.gitbook.io/documentation/open-source"><img src="https://img.shields.io/badge/View%20Documentation-Docs-yellow"></a>
  <a href="https://join.slack.com/t/promptengineersai/shared_invite/zt-21upjsftv-gX~gNjTCU~2HfbeM_ZwTEQ"><img src="https://img.shields.io/badge/Join%20our%20community-Slack-blue"></a>
</p>

<p align="center">
  <img src="https://github.com/promptengineers-ai/llm-server/blob/master/backend/static/llm-server.gif?raw=true" width="600px" />
</p>

## 🛠️ Setup API Server
```bash
### Change into Backend directory
cd backend

### Setup Virtual Env
python3 -m venv .venv

### Activate Virtual Env
source .venv/bin/activate

### Install Runtime & Dev Dependencies
pip install -r requirements.txt -r requirements-dev.txt

### Install Runtime Dependencies
pip install -r requirements.txt

### Migrate Database Schema
alembic upgrade head

### Seed Database Users
python3 -m src.seeds.users 3

### Run Application on local machine
bash scripts/dev.sh
```

## 🛠️ Setup Client 
```bash
### Change into Backend directory
cd frontend

### Install node_modules
npm install

### Start Development Server
npm run dev
```

### Environment Variables
<table border="1" width="100%">
  <tr>
    <th>Variable Name</th>
    <th>Example</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>APP_ENV</td>
    <td>'local'</td>
    <td>Environment where the application is running</td>
  </tr>
  <tr>
    <td>PINECONE_API_KEY</td>
    <td></td>
    <td>API key for Pinecone services</td>
  </tr>
  <tr>
    <td>PINECONE_ENV</td>
    <td>us-east1-gcp</td>
    <td>Pinecone environment configuration</td>
  </tr>
  <tr>
    <td>PINECONE_INDEX</td>
    <td>default</td>
    <td>Default Pinecone index used</td>
  </tr>
  <tr>
    <td>OPENAI_API_KEY</td>
    <td>sk-abc123...</td>
    <td>Default LLM OpenAI key</td>
  </tr>
  <tr>
    <td>GROQ_API_KEY</td>
    <td></td>
    <td>API key for accessing GROQ services</td>
  </tr>
  <tr>
    <td>ANTHROPIC_API_KEY</td>
    <td></td>
    <td>API key for accessing Anthropic services</td>
  </tr>
  <tr>
    <td>MINIO_HOST</td>
    <td>localhost:9000</td>
    <td>URL to the Object storage</td>
  </tr>
  <tr>
    <td>BUCKET</td>
    <td>my-documents</td>
    <td>Name of Minio or S3 bucket</td>
  </tr>
  <tr>
    <td>ACCESS_KEY_ID</td>
    <td>AKIAIOSFODNN7EXAMPLE</td>
    <td>IAM User Access Key ID &#40;Optional&#41;</td>
  </tr>
  <tr>
    <td>ACCESS_SECRET_KEY</td>
    <td>wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY</td>
    <td>Secret IAM Key &#40;Optional&#41;</td>
  </tr>
  <tr>
    <td>S3_REGION</td>
    <td>us-east-1</td>
    <td>Region where the S3 bucket exists &#40;Optional&#41;</td>
  </tr>
</table>

## Deploy
1. Log in to vercel
```bash
vercel login
```

2. Deploy to vercel
```bash
vercel .
```

## 🤝 How to Contribute

We welcome contributions from the community, from beginners to seasoned developers. Here's how you can contribute:

1. **Fork the repository**: Click on the 'Fork' button at the top right corner of the repository page on GitHub.

2. **Clone the forked repository** to your local machine: `git clone <forked_repo_link>`.

3. **Navigate to the project folder**: `cd llm-server`.

4. **Create a new branch** for your changes: `git checkout -b <branch_name>`.

5. **Make your changes** in the new branch.

6. **Commit your changes**: `git commit -am 'Add some feature'`.

7. **Push to the branch**: `git push origin <branch_name>`.

8. **Open a Pull Request**: Go back to your forked repository on GitHub and click on 'Compare & pull request' to create a new pull request.

Please ensure that your code passes all the tests and if possible, add tests for new features. Always write a clear and concise commit message and pull request description.

## 💡 Issues

Feel free to submit issues and enhancement requests. We're always looking for feedback and suggestions.

## 🤓 Maintainers

- `Ryan Eggleston` - `ryan.adaptivebiz@gmail.com`

## 📜 License

This project is open-source, under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as you please.

Happy Prompting! 🎉🎉