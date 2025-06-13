VERSION = $(jq -r .version codemeta.json)

HTML_PAGES = $(shell ls -1 *.md | grep -v 'presentation' | sed -E 's/.md/.html/g')

# where FORMAT is either s5, slidy, slideous, dzslides, or revealjs.
SLIDE_FORMAT = slidy

build: clean presentations website

CITATION.cff: codemeta.json
	cmt codemeta.json CITATION.cff

about.md: codemeta.json
	cmt codemeta.json about.md

website: CITATION.cff about.md .FORCE
	make -f website.mak

cleanweb: .FORCE
	rm $(HTML_PAGES)

presentations: .FORCE
	pandoc -V lang=en -s -t $(SLIDE_FORMAT) presentation1.md -o presentation1.html
	git add presentation1.html
	pandoc -V lang=en -s -t $(SLIDE_FORMAT) presentation2.md -o presentation2.html
	git add presentation2.html

pdf: .FORCE
	pandoc -V lang=en -s -t beamer presentation1.md -o presentation1.pdf
	pandoc -V lang=en -s -t beamer presentation2.md -o presentation2.pdf

pptx: .FORCE
	pandoc -V lang=en -s presentation1.md -o presentation1.pptx
	pandoc -V lang=en -s presentation2.md -o presentation2.pptx

clean: .FORCE
	@if [ -f presentation1.html ]; then rm presentation1.html; fi
	@if [ -f presentation1.pdf ];  then rm presentation1.pdf; fi
	@if [ -f presentation1.pptx ]; then rm presentation1.pptx; fi
	@if [ -f presentation2.html ]; then rm presentation2.html; fi
	@if [ -f presentation2.pdf ];  then rm presentation2.pdf; fi
	@if [ -f presentation2.pptx ]; then rm presentation2.pptx; fi

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
	pandoc -V lang=en -s -t beamer presentation2.md -o dist/presentation2.pdf
	pandoc -V lang=en -s presentation1.md -o dist/presentation1.pptx
	pandoc -V lang=en -s presentation2.md -o dist/presentation2.pptx
	cd dist && zip t2t3_dataset_web_apps-$(VERSION).zip README.md LICENSE CITATION.cff codemeta.json *.yaml presentation?.*

release: dist
	@printf "\n\nReady to run ./release.bash\n\n"

.FORCE:
