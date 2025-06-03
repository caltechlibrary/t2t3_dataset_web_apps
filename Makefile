
# where FORMAT is either s5, slidy, slideous, dzslides, or revealjs.
SLIDE_FORMAT = slidy

build: clean html

html: .FORCE
	pandoc -V lang=en -s -t $(SLIDE_FORMAT) presentation1.md -o presentation1.html
	git add presentation1.html

pdf: .FORCE
	pandoc -V lang=en -s -t beamer presentation1.md -o presentation1.pdf

pptx: .FORCE
	pandoc -V lang=en -s presentation1.md -o presentation1.pptx

clean: .FORCE
	@if [ -f presentation1.html ]; then rm presentation1.html; fi
	@if [ -f presentation1.pdf ];  then rm presentation1.pdf; fi
	@if [ -f presentation1.pptx ]; then rm presentation1.pptx; fi

status:
	git status

save:
	if [ "$(msg)" != "" ]; then git commit -am "$(msg)"; else git commit -am "Quick Save"; fi
	git push origin $(BRANCH)

publish: website
	bash publish.bash

dist: .FORCE
	@mkdir -p dist
	-rm dist/* >/dev/null
	cp -vR htdocs dist/
	cp -vR htdocs2 dist/
	cp *.yaml dist/
	cp README.md dist/
	cp LICENSE dist/
	cp CITATION.cff dist/
	cp codemeta.json dist/
	cp presentation1.md dist/
	cp presentation1.html dist/
	pandoc -V lang=en -s -t beamer presentation1.md -o dist/presentation1.pdf
	pandoc -V lang=en -s presentation1.md -o dist/presentation1.pptx
	cd dist && zip t2t3_dataset_web_apps-$(VERSION).zip README.md LICENSE CITATION.cff codemeta.json *.yaml presentation1.*

release: dist
	@printf "\n\nReady to run ./release.bash\n\n"

.FORCE:
