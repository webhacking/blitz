# `generator`

The generator package contains all of the infrastructure required to support Blitz's file templating scheme and file generation. All templates are located in `/templates` and use a custom templating scheme where variables are contained in `__underscores__` and get replaced at build time with the context variables provided in the `Generator` subclass. Generators all live in `/src/generators` and need to extend the `Generator` abstract class in order to function properly.
