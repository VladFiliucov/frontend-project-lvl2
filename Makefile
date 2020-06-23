install:
	npm i

lint:
	npx eslint .

test:
	npm test

test-coverage:
	test -- --coverage --coverageProvider=v8
