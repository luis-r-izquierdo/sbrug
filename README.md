# SBRUG: Sampling Best Response in Undercutting Games

SBRUG is an interactive NetLogo model that compares two ways of revising a strategy in undercutting games, such as the traveler's dilemma and the finitely repeated prisoner's dilemma:

- **Sampling BR:** a revising agent best responds to the strategies of a few randomly observed agents.
- **Exact BR:** a revising agent best responds to the exact population state.

Both rules run side by side, on two populations that share the revising agents and the experiments. You can watch how a rare experiment with a late strategy can spread under Sampling BR, while it barely matters under Exact BR.

**Website and online model:** https://luis-r-izquierdo.github.io/sbrug/

## Run the model

- **In your browser:** open the website and press *Load the interactive model*. No installation is needed.
- **In NetLogo:** download [SBRUG.zip](https://luis-r-izquierdo.github.io/sbrug/downloads/SBRUG.zip), unzip it and open `SBRUG.nlogox` with NetLogo 7.0.4 or later.

## Contents

- `index.html`, `styles.css`, `site.js` and `assets/`: the website.
- `model.html`: the model in NetLogo Web 2.16.0, as a standalone page that can also be saved and run offline.
- `downloads/SBRUG.nlogox` and `downloads/SBRUG.zip`: the model for desktop NetLogo.
- `downloads/preview-cooperation.json` and `downloads/preview-metadata.json`: data and reproduction details of the illustrated run on the website.
- `downloads/model.metadata.json`: versions and checksums of the browser model.
- `LICENSE.txt`: the GNU General Public License, version 3.

This repository holds the published website. Its files are generated from the authors' sources.

## How to cite

Luis R. Izquierdo and Segismundo S. Izquierdo (2026). *SBRUG: Sampling Best Response in Undercutting Games*. NetLogo model. https://luis-r-izquierdo.github.io/sbrug/

Related paper: Luis R. Izquierdo and Segismundo S. Izquierdo. *How Sampling and Experimentation Sustain Cooperation in Undercutting Games*.

## License

Copyright © 2026 Luis R. Izquierdo and Segismundo S. Izquierdo. SBRUG is free software under the GNU General Public License, version 3 or later; see `LICENSE.txt`. NetLogo Web, bundled in `model.html`, keeps its own notices.
