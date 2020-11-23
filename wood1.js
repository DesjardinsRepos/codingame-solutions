 

let actions, player, enemy;

const init = () => {

    const actionCount = +readline(); // the number of spells and recipes in play

    actions = [];

    for (let i = 0; i < actionCount; i++) {
        var inputs = readline().split(' ');

        actions.push({
            actionId: inputs[0],
            actionType: inputs[1],
            delta0: +inputs[2],
            delta1: +inputs[3],
            delta2: +inputs[4],
            delta3: +inputs[5],
            price: +inputs[6],
            tomeIndex: inputs[7],
            taxCount: inputs[8],
            castable: inputs[9],
            repeatable: inputs[10],
            worth: -1
        });
    }

    for (let i = 0; i < 2; i++) {
        var inputs = readline().split(' ');
        let inventory = {
            inv0: parseInt(+inputs[0]), // tier-0 ingredients in inventory
            inv1: parseInt(+inputs[1]),
            inv2: parseInt(+inputs[2]),
            inv3: parseInt(+inputs[3]),
            score: parseInt(+inputs[4]) // amount of rupees
        }
        i === 0 ? player = inventory : enemy = inventory;
    }
}

const isBrewable = delta => {
    if(
        player.inv0 >= delta.delta0
        && player.inv1 >= delta.delta1
        && player.inv2 >= delta.delta2
        && player.inv3 >= delta.delta3
    ) return true;
    return false;
}

const calcWorth = () => {
    actions.map(a => {
        isBrewable({ 
            delta0: a.delta0,
            delta1: a.delta1,
            delta2: a.delta2,
            delta3: a.delta3
        }) ? a.worth = a.price : a.worth = 0;
    })
}

const brewHighestWorth = () => {
    actions.sort((a, b) => {
        if(a.worth < b.worth) return 1;
        if(a.worth > b.worth) return -1;
        return 0;
    });
    print(`BREW ${actions[0].actionId}`);
}

for(;;) {
    init();
    calcWorth();
    brewHighestWorth();
    // in the first league: BREW <id> | WAIT; later: BREW <id> | CAST <id> [<times>] | LEARN <id> | REST | WAIT
}
