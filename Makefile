install:
	npm i
	npm pack

install_global:
	npm i -g VladFiliucov-gendiff-1.0.0.tgz

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8
