# Translation review — private preview only

Prepared 13 November 2026. Not approved for public deployment. User explicitly requires review on goddess before publishing these translations or the language UI to www.146lab.com.

Scope: all nine Experiments, About Vlad, Personal (apartment and Kurin), and the Experiments/Personal collection introductions. Russian except BMW 850 Ci in Ukrainian. Writing retains its original language. Existing Belka Russian prose preserved, consolidated into the same entry.

JSON files map text nodes of the source main element, in order. sourceHash prevents a build silently applying translations to an edited English page. Attributes contain translated image descriptions. Belka retains its existing Russian HTML as a separate content resource, not a separate navigable page.

Build: tools/build-six-studies.mjs; preview refresh: ../../tools/website-runtime/preview.py (relative to site parent workspace as documented in operations.log). No push or production deploy until owner approval.

Available language preference is stored locally. A ?lang=ru or ?lang=uk URL selects the same page in that language. Original text remains visible where a translation is absent. Previous Belka /ru/ addresses redirect to its unified page.
