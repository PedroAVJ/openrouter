# OpenRouter App

OpenRouter as a named service integration. The first owned workflow covers its
asynchronous multi-model video API: current model discovery, guarded request
submission, polling, download, and generation provenance.

The plugin deliberately does not freeze a favorite provider or model. The
OpenRouter model endpoint is the source of truth for availability, supported
parameters, and current pricing.
