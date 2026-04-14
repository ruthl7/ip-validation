# IP Validator (Angular + Node + Kubernetes + GHCR)

Very simple full-stack project:
- Frontend: Angular app with one form to validate IP addresses
- Backend: Node.js (Express) API endpoint that checks IPv4 and IPv6
- Containerized with Docker
- Kubernetes manifests for deployment with kubectl
- GitHub Actions workflow to publish images to GHCR

## 1) Run locally (without Docker)

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm start
```

Open http://localhost:4200

## 2) Run locally with Docker Compose

```bash
docker compose up --build
```

Open http://localhost:8080

## 3) Build and push images to GHCR

Workflow file: .github/workflows/ghcr-build.yml

On push to main (or manual workflow dispatch), GitHub Actions builds and pushes:
- ghcr.io/<owner>/ip-validator-backend:latest
- ghcr.io/<owner>/ip-validator-frontend:latest

Also pushes SHA tags for both images.

## 4) Deploy with kubectl

1. Update image names in:
- k8s/backend.yaml
- k8s/frontend.yaml

Replace your-github-username with your GitHub owner name.

2. Apply manifests:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

3. Verify:

```bash
kubectl -n ip-validator get pods
kubectl -n ip-validator get svc
```

Frontend is exposed as NodePort 30080. If you use minikube/docker desktop, open via node IP and port 30080.

Alternative access (works everywhere):

```bash
kubectl -n ip-validator port-forward service/frontend-service 8080:80
```

Then open http://localhost:8080

## Notes about private GHCR images

If your GHCR packages are private, create an image pull secret and attach it to the deployments.
