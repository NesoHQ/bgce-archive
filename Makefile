arcdocs-index:
	chmod +x ./scripts/docs/generate_index.sh && ./scripts/docs/generate_index.sh

arcdocs: arcdocs-index
	chmod +x ./scripts/docs/run.sh && ./scripts/docs/run.sh

arcdocs-serve:
	chmod +x ./scripts/docs/serve.sh && ./scripts/docs/serve.sh