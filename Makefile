SHELL=/bin/bash

.PHONY : lint
lint :
	ruff check --output-format=github .

.PHONY : format
format :
	npx prettier src/ --write

.PHONY : format-check
format-check :
	npx prettier src/ --check