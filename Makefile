install:
	npm i
	npm pack
	npm i -g VladFiliucov-gendiff-1.0.0.tgz

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8
