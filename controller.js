

const DAYCARE = -1;
const PARTY = 0;

class MainPageController {
    constructor (view) {
        this.sav = null;
        this.selectedBox = 0;
        this.selectedPkmn = -1;
        this.view = view;
        this.storage = new SavStorage();
        this.callback = view.callback;
    }

    loadAllFiles () {
        this.storage.getAllFiles().then( allFiles => {
            if (allFiles.length === 0) {
                return; // no change is done.
            } else {
                this.view.fileList.textContent = ''; // removing all text from fileList
            }
            for (const file of allFiles) {
                // <div class="cart-file">
                //     <img src="img/yellow-cart.svg" class="cart-svg">
                //     <span class="cart-text">YELLOW TESTTEST12</span>
                // </div>
                const img = document.createElement('img');
                img.src = 'img/' + file.version + '-cart.svg';
                img.classList.add('cart-svg');
                const span = document.createElement('span');
                span.classList.add('cart-text');

                let label = file.label;
                span.textContent = label + ' ' + file.version + ' ' + file.trainerName;
                const div = document.createElement('div');
                div.classList.add('cart-file');
                div.appendChild(img);
                div.appendChild(span);
                div.draggable = true;
                div.onclick = () => this.handleFileLoad(file);
                this.view.fileList.appendChild(div);
            }
        });
    }

    onBoxSelected(event) {
        this.cleanPkmn();
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
        const version = this.getVersionFromName(event.target.files[0].name);
        reader.onloadend = e => {
            const array = new Uint8Array(e.target.result);
            const bin = new BinaryFile(array, version.codec);
            const sav = new version.savClass(bin);
            this.storage.addFile({
                label: this.makeLabel(8),
                trainerId: sav.trainerId,
                trainerName: sav.trainerName,
                version: version.name,
                country: 'US',
                generation: version.gen,
                data: new Blob([array])
            }).then(_ => {
                this.loadAllFiles();
                document.querySelector("#inputFile").value = '';
            });
        };
        reader.readAsArrayBuffer(event.target.files[0]);
    }

    getVersionFromRecord(fileRecord) {
        for (const version of SUPPORTED_VERSIONS) {
            if (fileRecord.version === version.name) {
                return version;
            }
        }
        return {
            name: fileRecord.version,
            gen: 'UNDEFINED'
        };
    }

    getVersionFromName(fileName) {
        fileName = fileName.toUpperCase();
        for (const version of SUPPORTED_VERSIONS) {
            if (fileName.includes(version.name)) {
                return version;
            }
        }
        return {
            name: 'GREY',
            gen: 'UNDEFINED'
        };
    }

    handleFileLoad(file) {
        this.cleanPkmn();
        file.data.arrayBuffer().then(result => {
            const array = new Uint8Array(result);
            const version = this.getVersionFromRecord(file);
            const bin = new BinaryFile(array, version.codec);
            this.sav = new version.savClass(bin);

            // if (array.length < GEN_I_SAV_FILE_SIZE) {
            //     alert("not a valid file, size is less than " + GEN_I_SAV_FILE_SIZE + " bytes");
            //     return;
            // }

            this.view.trainerName.value = this.sav.trainerName;
            this.view.trainerName.onchange = e => this.sav.trainerName = e.target.value;

            this.view.rivalName.value = this.sav.rivalName;
            this.view.rivalName.onchange = e => this.sav.rivalName = e.target.value;

            this.view.trainerMoney.value = '$' + this.sav.trainerMoney;
            this.view.trainerCoins.value = this.sav.trainerCoins;
            this.view.trainerId.value = this.sav.trainerId;

            this.setEntries2(this.view.badges, this.sav.badges, this.createBadgeEntry);

            this.view.playTime.value = this.sav.playTime;
            this.view.pikaFriendship.value = this.sav.pikaFriendship;

            this.setEntries("#itemBag", this.sav.itemBag, this.createItemEntry);
            this.setEntries("#itemBox", this.sav.itemBox, this.createItemEntry);
            this.setEntries("#pokedexEntries", this.sav.pokedex, this.createDexEntry);
            this.setEntries("#hallOfFame", this.sav.hallOfFame, this.createHallEntry);
            this.setPkmnList();
            this.view.fileLabel.textContent = ": " + file.version + ' (' + file.label + ')' ;
            this.view.callback();
        });
    }

    onPkmnClick(event) {
        const SELECTED_CLASS = 'selected-pkmn';
        if (this.lastSelected !== undefined) {
            if (document.querySelector('#pkmnBox').contains(this.lastSelected)) {
                this.lastSelected.classList.remove(SELECTED_CLASS);
            }
        }
        this.lastSelected = event.target;
        const identifier = event.target.id;

        if (identifier.length === 0) return; // not a pkmn.
        document.querySelector("#" + identifier).classList.add(SELECTED_CLASS);
        const parts = identifier.split('-');
        const index = parts[1];
        this.selectedPkmn = index - 1;
        if (this.selectedBox === 0) {
            this.displayPkmn(this.sav.party[this.selectedPkmn]);
        } else {
            this.displayPkmn(this.sav.boxes[this.selectedBox -1][this.selectedPkmn]);
        }
    }

    onDownload(_) {
        const bytes = this.sav.bytes;
        const blob = new Blob([bytes]);
        const fileName = 'NewSaveFile.pos';

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    setEntries2(element, list, entryCreator){
        element.textContent = '';
        for (const data of list) {
            const entry = entryCreator.call(this, data);
            element.appendChild(entry);
        }
    }

    setEntries(selector, list, entryCreator) {
        // cleaning the list:
        this.setEntries2(document.querySelector(selector), list, entryCreator);
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
            (pkmn.type1 === pkmn.type2) ? pkmn.type1.name : pkmn.type1.name + '/' + pkmn.type2.name;

        document.querySelector("#pkmnOtIdNumber").value = pkmn.otIdNumber;
        document.querySelector("#pkmnOtName").value = pkmn.otName;
        this.setStatStr("#pkmnAttack", pkmn.attack, pkmn.attackEv, pkmn.attackIv);
        this.setStatStr("#pkmnDefense", pkmn.defense, pkmn.defenseEv, pkmn.defenseIv);
        this.setStatStr("#pkmnSpeed", pkmn.speed, pkmn.attackEv, pkmn.attackIv);
        if (pkmn.genFormat === 'I') {
            document.querySelector("#pkmnSpecialAtk").style.display = 'none'
            document.querySelector("#pkmnSpecialDef").style.display = 'none'
            document.querySelector("#pkmnSpecial").style.display = 'list-item'
            this.setStatStr("#pkmnSpecial", pkmn.special, pkmn.specialEv, pkmn.specialIv);
        } else {
            document.querySelector("#pkmnSpecial").style.display = 'none'
            document.querySelector("#pkmnSpecialAtk").style.display = 'list-item'
            document.querySelector("#pkmnSpecialDef").style.display = 'list-item'
            this.setStatStr("#pkmnSpecialAtk", pkmn.specialAtk, pkmn.specialEv, pkmn.specialIv);
            this.setStatStr("#pkmnSpecialDef", pkmn.specialDef, pkmn.specialEv, pkmn.specialIv);
        }
        this.setStatStr("#pkmnHpStat", pkmn.maxHp, pkmn.hpEv, pkmn.hpIv);
        for (let i = 0; i < 4; ++i) {
            const move = pkmn.moves[i];
            const prefix = "#move-" + (i+1);
            if (move === null) {
                this.setText(prefix + "-name", '--');
                this.setText(prefix + "-pp", '-');
                this.setText(prefix + "-type", '???');
                const typeElement = document.querySelector(prefix + "-type");
                if (typeElement) {
                    typeElement.remove();
                }
            } else {
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


                let typeElement = document.querySelector(prefix + "-type");
                if (!typeElement) {
                    typeElement = document.createElement('div');
                    document.querySelector(prefix).appendChild(typeElement);
                }
                const typeClass = (move.type === PKTP_QQQQ ? 'qqqq': move.type.name.toLowerCase() ) + '-type'
                typeElement.className = "chip " + typeClass;
                typeElement.textContent = move.type.name;

            }
        }
        M.updateTextFields();
    }

    cleanPkmn()  {
        document.querySelector("#pkmnNickname").value = null;
        document.querySelector("#pkmnSpecies").value = null;
        document.querySelector("#pkmnLevel").value = null;
        document.querySelector("#pkmnExperience").value = null;
        document.querySelector("#pkmnExpToNextLevel").value = null;
        document.querySelector("#pkmnCurHp").value = null;
        document.querySelector("#pkmnStatus").value = null;
        document.querySelector("#pkmnHeldItem").value = null;
        document.querySelector("#pkmnType").value = null;

        document.querySelector("#pkmnOtIdNumber").value = null;
        document.querySelector("#pkmnOtName").value = null;
        document.querySelector("#pkmnAttackValue").value = null;
        document.querySelector("#pkmnAttackHidden").value = null;
        document.querySelector("#pkmnDefenseValue").value = null;
        document.querySelector("#pkmnDefenseHidden").value = null;
        document.querySelector("#pkmnSpeedValue").value = null;
        document.querySelector("#pkmnSpeedHidden").value = null;
        document.querySelector("#pkmnSpecialValue").value = null;
        document.querySelector("#pkmnSpecialHidden").value = null;
        document.querySelector("#pkmnHpStatValue").value = null;
        document.querySelector("#pkmnHpStatHidden").value = null;
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

            const noNick = pkmn.speciesName.toUpperCase() === pkmn.nickname.toUpperCase();
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
        if (pkmn.owned || pkmn.seen) {
            let span = document.createElement('span');
            span.classList.add('secondary-content');
            if (pkmn.owned) {
                span.appendChild(document.createTextNode( 'owned' ));
            } else if(pkmn.seen) {
                li.style.setProperty('background-color','rgb(241 238 238)');
                span.appendChild(document.createTextNode( 'seen' ));
            }
            li.appendChild(span);
        }
        li.appendChild(document.createTextNode("#" + pkmn.index + ' ' + pkmn.name));
        return li;
    }

    createBadgeEntry(badge) {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.disabled = badge.obtained;
        const span = document.createElement('span');
        span.textContent = badge.name;
        const label = document.createElement('label');
        label.appendChild(input);
        label.appendChild(span);
        const div = document.createElement('div');
        div.classList.add('col', 's6', 'm3');
        div.appendChild(label);
        return div;
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

    makeLabel(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
