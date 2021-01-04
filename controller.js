

const DAYCARE = -1;
const PARTY = 0;

class MainPageController {
    constructor (view) {
        this.sav = null;
        this.selectedBox = 0;
        this.selectedPkmn = -1;
        this.view = view;
    }

    onBoxSelected(event) {
        this.selectedBox = parseInt(event.target.value, 10);
        if (this.sav != null) {
            this.setPkmnList();
        }
    }

     setPkmnList() {
        switch(this.selectedBox){
            case DAYCARE: 
                if (this.sav.daycare.inUse) {
                    this.setEntries("#pkmnBox", [this.sav.daycare.pkmn], this.createPkmnEntry); 
                } else {
                    this.setEntries("#pkmnBox", [], null); 
                }
                return;
            case PARTY: 
                this.setEntries("#pkmnBox", this.sav.party, this.createPkmnEntry); 
                return;
            default: 
                this.setEntries("#pkmnBox", this.sav.boxes[this.selectedBox - 1], this.createPkmnEntry); 
                return;
        }
    }

    onFileChanged(event) {
        const reader = new FileReader();
        reader.onload = e => this.handleFileLoad(e);
        reader.readAsArrayBuffer(event.target.files[0]);
    }

    handleFileLoad(event) {
        const array = new Uint8Array(event.target.result);
        const bin = new BinaryFile(array, AMERICA_TEXT_CODEC);
        this.sav = new SaveFile(bin);


        if(array.length < SAV_FILE_SIZE) {
            alert("not a valid file, size is less than " + SAV_FILE_SIZE + " bytes");
            return;
        }

        this.view.trainerName.value    = this.sav.trainerName;
        this.view.trainerName.onchange = e => this.sav.trainerName = e.target.value;

        this.view.rivalName.value      = this.sav.rivalName;
        this.view.rivalName.onchange   = e => this.sav.rivalName = e.target.value;

        this.view.trainerMoney.value   = '$' + this.sav.trainerMoney;
        this.view.trainerCoins.value   = this.sav.trainerCoins;
        this.view.trainerId.value      = this.sav.trainerId;

        this.view.boulderBadge.checked = this.sav.badges.boulder;
        this.view.cascadeBadge.checked = this.sav.badges.cascade;
        this.view.thunderBadge.checked = this.sav.badges.thunder;
        this.view.rainbowBadge.checked = this.sav.badges.rainbow;
        this.view.soulBadge.checked    = this.sav.badges.soul;
        this.view.marshBadge.checked   = this.sav.badges.marsh;
        this.view.volcanoBadge.checked = this.sav.badges.volcano;
        this.view.earthBadge.checked   = this.sav.badges.earth;

        this.view.playTime.value       = this.sav.playTime;
        this.view.pikaFriendship.value = this.sav.pikaFriendship;

        this.setEntries("#itemBag", this.sav.itemBag, this.createItemEntry); 
        this.setEntries("#itemBox", this.sav.itemBox, this.createItemEntry);
        this.setEntries("#pokedexEntries", this.sav.pokedex, this.createDexEntry);
        this.setEntries("#hallOfFame", this.sav.hallOfFame, this.createHallEntry);
        this.setPkmnList();

        M.updateTextFields();
    }

    onPkmnClick(event) {
        const identifier = event.target.id;
        if (identifier.length == 0) return; // not a pkmn.
        document.querySelector("#" + identifier).classList.add('selected');
        const parts = identifier.split('-');
        const index = parts[1];
        this.selectedPkmn = index - 1;
        if (this.selectedBox == 0) {
            this.displayPkmn(this.sav.party[this.selectedPkmn]);
        } else {
            this.displayPkmn(this.sav.boxes[this.selectedBox -1][this.selectedPkmn]);
        }
    }

    onDownload(event) {
        const bytes = this.sav.bytes;
        const blob = new Blob([bytes]);
        const fileName = 'NewSaveFile.sav';

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }


    setEntries(selector, list, entryCreator) {
        // cleaning the list:
        document.querySelector(selector).textContent = '';
        for (const element of list) {
            const entry = entryCreator.call(this, element);
            document.querySelector(selector).appendChild(entry);
        }
    }

    displayPkmn (pkmn) {
        document.querySelector("#pkmnNickname").value = pkmn.nickname;
        document.querySelector("#pkmnSpecies").value = pkmn.species.name;
        document.querySelector("#pkmnLevel").value = pkmn.level;
        document.querySelector("#pkmnExperience").value = pkmn.experience;
        document.querySelector("#pkmnExpToNextLevel").value = pkmn.expToNextLevel;
        document.querySelector("#pkmnCurHp").value = pkmn.currentHp + "/" + pkmn.maxHp;
        document.querySelector("#pkmnStatus").value = pkmn.status;
        document.querySelector("#pkmnHeldItem").value =  pkmn.heldItem;
        document.querySelector("#pkmnType").value = 
            (pkmn.type1 == pkmn.type2) ? pkmn.type1 : pkmn.type1 + '/' + pkmn.type2;

        document.querySelector("#pkmnOtIdNumber").value = pkmn.otIdNumber;
        document.querySelector("#pkmnOtName").value = pkmn.otName;
        this.setStatStr("#pkmnAttack", pkmn.attack, pkmn.attackEv, pkmn.attackIv);
        this.setStatStr("#pkmnDefense", pkmn.defense, pkmn.defenseEv, pkmn.defenseIv);
        this.setStatStr("#pkmnSpeed", pkmn.speed, pkmn.attackEv, pkmn.attackIv);
        this.setStatStr("#pkmnSpecial", pkmn.special, pkmn.specialEv, pkmn.specialIv);
        this.setStatStr("#pkmnHpStat", pkmn.maxHp, pkmn.hpEv, pkmn.hpIv);
        for (let i = 0; i < 4; ++i) {
            const move = pkmn.moves[i];
            if (move != null) {
                const prefix = "#move-" + (i+1);
                let suffix = null;
                switch (move.appliedPpUps) {
                    case 3: suffix = '‴'; break;
                    case 2: suffix = '″'; break;
                    case 1: suffix = '′'; break;
                    case 0: suffix = ''; break;
                    default: suffix = '*'; break;
                }
                this.setText(prefix + "-name", "#" + move.index + " " + move.name);
                this.setText(prefix + "-pp", move.currentPp + "/" + move.maxPp + suffix);
            }
        }
        M.updateTextFields();
    }

    setStatStr(selector, value, ev, iv) {
        this.setText(selector + "Value", value);
        this.setText(selector + "Hidden", "EV:" + ev + "-IV:" + iv);
    }

    createHallEntry(entry) {
        const ul = document.createElement('ul');
        ul.classList.add('collection');
        for (const pkmn of entry.team) {
            const span = document.createElement('span');
            span.classList.add('secondary-content');
            span.textContent = pkmn.level;

            const noNick = pkmn.speciesName.toUpperCase() == pkmn.nickname.toUpperCase();
            const displayName = (noNick) ? 
                pkmn.speciesName : pkmn.speciesName + " - " + pkmn.nickname;

            const innerIl = document.createElement('li');
            innerIl.textContent = "#" + pkmn.speciesNumber + " " + displayName;
            innerIl.appendChild(span);
            ul.appendChild(innerIl);
        }

        const li = document.createElement('li');
        li.appendChild(document.createTextNode('ENTRY #' + entry.index));
        li.appendChild(ul);
        return li;
    }

    pad(src, size, paddingChar) {
        let str = src.toString();
        while (num.length < size) { 
            str = paddingChar + str;
        }
        return str;
    }

    setText (selector, value) {
        document.querySelector(selector).textContent = value;
    }

    createPkmnEntry(pkmn) {
        const hpBar = document.createElement('input')
        hpBar.style.setProperty('width','auto');
        hpBar.type = 'range'
        hpBar.disabled = true;
        hpBar.min = 0;
        hpBar.max = pkmn.maxHp;
        hpBar.value = pkmn.currentHp;
        const li = document.createElement('li');
        li.classList.add("collection-item");
        li.classList.add("clickable");
        li.appendChild(document.createTextNode(
            "#" + pkmn.number + " " + pkmn.species.name + " L" + pkmn.level));
        li.appendChild(document.createElement("br"));
        li.appendChild(document.createTextNode('HP'));
        li.appendChild(hpBar);
        li.onclick = (e) => this.onPkmnClick(e);
        li.id = 'pkmn-' + pkmn.position;
        li.appendChild(document.createTextNode(pkmn.currentHp + '/' + pkmn.maxHp));
        return li;
    }

    createDexEntry (pkmn) {
        let li = document.createElement('li');
        li.classList.add("collection-item");
        if (!pkmn.owned && pkmn.seen) {
            li.style.setProperty('background-color','#e4e4e4')
        } else {
            let span = document.createElement('span');
            span.classList.add('secondary-content');
            span.appendChild(document.createTextNode( pkmn.owned ? 'owned' : 'seen' ));
            li.appendChild(span);
        }
        li.appendChild(document.createTextNode("#" + pkmn.index + ' ' + pkmn.name));
        return li;
    }

    createItemEntry(item) {
        let span = document.createElement('span');
        span.classList.add('secondary-content');
        span.appendChild(document.createTextNode("x" + item.count));

        let div = document.createElement('div');
        div.appendChild(document.createTextNode(item.name));
        div.appendChild(span);

        let li = document.createElement('li');
        li.classList.add("collection-item");
        li.appendChild(div); 
        return li;
    }
}

