arcdocs-index:
	chmod +x ./scripts/doc_index_test.sh && ./scripts/doc_index_test.sh

arcdocs: arcdocs-index
	chmod +x ./scripts/docs.sh && ./scripts/docs.sh


