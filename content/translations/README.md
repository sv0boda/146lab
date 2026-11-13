# Translation review — private preview only

Prepared 13 November 2026. Not approved for public deployment. User explicitly requires review on goddess before publishing these translations or the language UI to www.146lab.com.

Scope: all nine Experiments, About Vlad, Personal (apartment and Kurin), and the Experiments/Personal collection introductions. Russian except BMW 850 Ci; Ukrainian now covers every Russian-translated page as well as BMW 850 Ci. Ukrainian additions translated directly from the English originals by the assistant at the owner’s request; no Anubis/GLM output used. Writing retains its original language. Existing Belka Russian prose preserved, consolidated into the same entry.

JSON files map text nodes of the source main element, in order. sourceHash prevents a build silently applying translations to an edited English page. Attributes contain translated image descriptions. Belka retains its existing Russian HTML as a separate content resource, not a separate navigable page.

Build: tools/build-six-studies.mjs; preview refresh: ../../tools/website-runtime/preview.py (relative to site parent workspace as documented in operations.log). No push or production deploy until owner approval.

Language choice is per page, with no stored or global preference and no navigation badges. Ukrainian is offered to every browser on translated pages. Russian is additionally offered only when the browser’s primary language is ru. English remains the initial text. The default is always the original English, regardless of browser language. Writing keeps its original language. Secondary preferred languages are not used to infer a translation preference. An explicit ?lang=ru or ?lang=uk URL selects the same page in that language only when that language is offered; ordinary navigation opens the next page in its original language. Russian and Ukrainian versions display a notice that the English original was automatically translated by a large language model and wording may sound odd or be inaccurate. Previous Belka /ru/ addresses redirect to its unified page.
