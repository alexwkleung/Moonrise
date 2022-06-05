.PHONY: build
build: 
	npm run build

.PHONY: bundle
bundle: 
	npm run bundle
	
.PHONY: electron
electron: 
	npm run electron

.PHONY: package
package:
	npm run package

.PHONY: package-arm
package-arm: 
	npm run package-arm