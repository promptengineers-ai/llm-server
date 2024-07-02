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
  <img src="https://github.com/promptengineers-ai/llm-server/blob/master/docs/assets/llm-server.gif?raw=true" width="600px" />
</p>

## 📖 Table of Contents

- [Deploy](https://github.com/promptengineers-ai/llm-server/blob/development/docs/deploy)
- [Tools](https://github.com/promptengineers-ai/llm-server/blob/development/docs/tools)

## 🛠️ Setup Services
```bash
### Setup Docker Services
docker-compose up --build
```

## 🛠️ Setup Server

Before running the server make sure to take a look at `cp .example.env .env` see [Environment Variables](https://github.com/promptengineers-ai/llm-server?tab=readme-ov-file#environment-variables).

```bash
### Change into Backend directory
cd backend

### Setup Virtual Env
python3 -m venv .venv

### Activate Virtual Env
source .venv/bin/activate

### Install Runtime & Dev Dependencies
pip install -r requirements.txt -r requirements-dev.txt -c constaints.txt

### Install Runtime Dependencies
pip install -r requirements.txt -c constaints.txt

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
    <td>'development'</td>
    <td>Environment where the application is running</td>
  </tr>
  <tr>
    <td>APP_VERSION</td>
    <td>0.0.1</td>
    <td>Version of the application</td>
  </tr>
  <tr>
    <td>APP_SECRET</td>
    <td>this-is-top-secret</td>
    <td>Secret key for the application</td>
  </tr>
  <tr>
    <td>APP_WORKERS</td>
    <td>1</td>
    <td>Number of application workers</td>
  </tr>
  <tr>
    <td>APP_ADMIN_EMAIL</td>
    <td>admin@example.com</td>
    <td>Admin email for the application</td>
  </tr>
  <tr>
    <td>APP_ADMIN_PASS</td>
    <td>test1234</td>
    <td>Admin password for the application</td>
  </tr>
  <tr>
    <td>TEST_USER_ID</td>
    <td>0000000000000000000000000</td>
    <td>Test user ID</td>
  </tr>
  <tr>
    <td>DATABASE_URL</td>
    <td>mysql+aiomysql://admin:password@localhost:3306/llm_server</td>
    <td>URL for the database</td>
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
    <td>REDIS_URL</td>
    <td>redis://localhost:6379</td>
    <td>URL for the Redis service</td>
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
    <td>OLLAMA_BASE_URL</td>
    <td>http://localhost:11434</td>
    <td>Base URL for the Ollama service</td>
  </tr>
  <tr>
    <td>SEARX_SEARCH_HOST_URL</td>
    <td>http://localhost:8080</td>
    <td>URL for the Searx search service</td>
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
    <td>S3_REGION</td>
    <td>us-east-1</td>
    <td>Region where the S3 bucket exists</td>
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
</table>

## 🚀 Roadmap

Here are the upcoming features I'm (ryaneggleston@promptengineers.ai) is excited to bring to Prompt Engineers AI - LLM Server (More to come):

- [x] 🤖 **Foundation Model Providers Supported (OpenAI, Anthropic, Ollama, Groq, Google... coming soon.)**
- [x] 📸 **Multi-Modal Models Generation**
- [x] 📑 **Retrieval Augmented Generation (RAG)**
- [x] 🛠 **UI-Based Tool Configuration**
- [x] 🖥 [**Code Interpreter**](https://github.com/promptengineers-ai/llm-server/blob/52b82eee1744d2b9543f788b835082c72fb8869c/backend/src/tools/__init__.py#L89) 
  - ⚠️ Use with Caution. Recommend [E2B Data Analysis](https://python.langchain.com/v0.2/docs/integrations/tools/e2b_data_analysis/)
- [ ] 🌑 **Dark Mode**
- [ ] 🎨 **Configure Custom Theme and Logos**    
- [ ] 🤖 **Assistant Creation Capability**

Create an issue and lets start a discussion if you'd like to see a feature added to the roadmap.

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

- `Ryan Eggleston` - `ryaneggleston@promptengineers.ai`

## 📜 License

This project is open-source, under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as you please.

Happy Prompting! 🎉🎉