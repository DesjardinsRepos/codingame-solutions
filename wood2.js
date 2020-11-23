
let actions, player, enemy;

const init = () => {                       // initialize all values

    const actionCount = +readline(); // the number of spells and recipes in play

    actions = [];

    for (let i = 0; i < actionCount; i++) {
        var inputs = readline().split(' ');

        if(inputs[1] !== 'OPPONENT_CAST') actions.push({
            actionId: +inputs[0],
            actionType: inputs[1],
            delta0: +inputs[2],
            delta1: +inputs[3],
            delta2: +inputs[4],
            delta3: +inputs[5],
            price: +inputs[6],
            tomeIndex: +inputs[7],
            taxCount: +inputs[8],
            castable: +inputs[9],
            repeatable: +inputs[10],
            worth: -1,

            value: -1
        });
    }

    for (let i = 0; i < 2; i++) {
        var inputs = readline().split(' ');

        let inventory = {
            inv0: +inputs[0],
            inv1: +inputs[1],
            inv2: +inputs[2],
            inv3: +inputs[3],
            score: +inputs[4] // amount of rupees
        }
        i === 0 ? player = inventory : enemy = inventory;
    }
};

const calcBrewValue = () => {              // calculate value of potions and return the most valueable one
    const potions = [];

    actions.map(a => {
        if(a.actionType === 'BREW') {
            a.value = 10 * a.price / ( -a.delta0 - 2 * a.delta1 - 4 * a.delta2 - 8 * a.delta3);
            potions.push(a);
        }
    });

    potions.sort((a, b) => {
        return a.value < b.value ? 1 : a.value > b.value ? -1 : 0;
    });

    return potions[0];
};

const isBrewable = a => {                  // calculate if a potion is brewable
    if(
        player.inv0 >= -a.delta0
        && player.inv1 >= -a.delta1
        && player.inv2 >= -a.delta2
        && player.inv3 >= -a.delta3
    ) return true;

    return false;
};

const isReady = a => {                     // calculate if a spell is ready to cast
    return a.castable > 0 ? true : false;
};

const isCastable = a => {                  // calculate if a spell is castable
    if(
        player.inv0 >= -a.delta0
        && player.inv1 >= -a.delta1
        && player.inv2 >= -a.delta2
        && player.inv3 >= -a.delta3
        && a.castable > 0
    ) return true;

    return false;
};

const outputAction = a => {                // execute the specified action
    print(`${a.actionType} ${a.actionId}`)
};

const brewIfPossible = a => {              // brew a potion if possible, else calculate optimal spell
    
    if(isBrewable(a)) {
        outputAction(a);
        return true;

    } else {
        calculateNeededSpells(a);
        return false;
    } 
};

const calculateNeededSpells = potion => {  // calculate which ingredients are needed

    getSpell([                         // the needed ingredients
        player.inv0 + potion.delta0 < 0 ? - player.inv0 - potion.delta0 : 0,
        player.inv1 + potion.delta1 < 0 ? - player.inv1 - potion.delta1 : 0,
        player.inv2 + potion.delta2 < 0 ? - player.inv2 - potion.delta2 : 0,
        player.inv3 + potion.delta3 < 0 ? - player.inv3 - potion.delta3 : 0
    ]);
};

const getSpell = diff => {                 // calculate the optimal spell to cast. if none available, rest.

    let spells = [];

    actions.map(a => {                     // push all spells in array
        if(a.actionType === 'CAST') spells.push(a);
    });

    for(let i = 3; i > -1; i--) {

        if(diff[i] > 0 && isReady(spells[i])) {
            if(isCastable(spells[i])) {
                castSpell(spells[i]);      // if needed, ready and castable, cast the spell
                return;
            } else {
                diff[i - 1]++;             // if ready but not castable, increase the amount of needed ingredients
            }                              // of tier [i - 1] by 1, to make it castable the next turn
        }
    }

    rest();
};

const castSpell = a => {                    // cast the specified spell
    outputAction(a);
};

const rest = () => {                        // output option "rest"
    outputAction({
        actionType: 'REST',
        actionId: ''
    });
};

for(;;) {
    init();

    brewIfPossible(calcBrewValue());
    
    // in the first league: BREW <id> | WAIT; later: BREW <id> | CAST <id> [<times>] | LEARN <id> | REST | WAIT
}
