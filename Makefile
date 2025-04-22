arcdocs-index:
	chmod +x ./scripts/doc_index.sh && ./scripts/doc_index.sh

arcdocs: arcdocs-index
	chmod +x ./scripts/docs.sh && ./scripts/docs.sh


