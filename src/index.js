const { createElement: h } = X;

const $ceilingStr = X.toReactive('100');
const $floorStr = X.toReactive('0');
const $targetStr = X.toReactive('50');
const $ceiling = $ceilingStr.map(Number);
const $floor = $floorStr.map(Number);
const $target = $targetStr.map(Number);

let realTarget = 0;

/**
 * @typedef {'init' | 'guess' | 'end'} Status
 * @type {X.ReactiveValue<Status>}
 */
const $status = X.toReactive('init');

/**
 * @type {Map<Status, string>}
 */
const submitTextMap = new Map([
    ['init', '开始'],
    ['guess', '尝试'],
    ['end', '重来'],
]);

$ceiling.watch(ceiling => {
    if ($target.current > ceiling) {
        $targetStr.setSync(String(ceiling));
    }
});

$floor.watch(floor => {
    if ($target.current < floor) {
        $targetStr.setSync(String(floor));
    }
});

$target.watch(target => {
    if (target > $ceiling.current) {
        $targetStr.setSync(String($ceiling.current));
    } else if (target < $floor.current) {
        $targetStr.setSync(String($floor.current));
    }
});

document.body.appendChild(
    h('div', {
        id: 'app',
        style: {
            padding: '3em 0',
            textAlign: 'center',
        },
    },
        h('h1', {
            id: 'title',
            style: {
                fontSize: '1.5em',
                marginBottom: '1em',
            },
        },
            '猜数字',
        ),
        h('form', {
            id: 'form',
            action: 'javascript:;',
            listeners: {
                submit() {
                    switch ($status.current) {
                        case 'init': {
                            realTarget = $target.current;
                            $targetStr.setSync('');
                            $status.setSync('guess');
                            break;
                        };
                        case 'guess': {
                            const target = $target.current;
                            if (!$targetStr.current) {
                                break;
                            }
                            if (target > realTarget) {
                                alert('猜大了！');
                                $ceilingStr.setSync(String(target));
                            } else if (target < realTarget) {
                                alert('猜小了！');
                                $floorStr.setSync(String(target));
                            } else {
                                alert('猜中了！');
                                $status.setSync('end');
                            }
                            break;
                        };
                        case 'end': {
                            $ceilingStr.setSync('100');
                            $floorStr.setSync('0');
                            $targetStr.setSync('50');
                            $status.setSync('init');
                            break;
                        };
                    }
                },
            },
        },
            D.Section(null,
                h('label', {
                    for: 'ceiling',
                },
                    '上界：',
                ),
                D.TextInput({
                    id: 'ceiling',
                    name: 'ceiling',
                    type: 'number',
                    bind: $ceilingStr,
                    readOnly: $status.map(
                        status => (status !== 'init')
                    ),
                }),
            ),
            D.Section(null,
                h('label', {
                    for: 'floor',
                },
                    '下界：',
                ),
                D.TextInput({
                    id: 'floor',
                    name: 'floor',
                    type: 'number',
                    bind: $floorStr,
                    readOnly: $status.map(
                        status => (status !== 'init')
                    ),
                }),
            ),
            D.Section(null,
                h('label', {
                    for: 'target',
                },
                    $status.map(
                        status => (status === 'guess' ? '猜测：' : '目标：')
                    ).toText(),
                ),
                D.TextInput({
                    id: 'target',
                    name: 'target',
                    type: 'number',
                    bind: $targetStr,
                    readOnly: $status.map(
                        status => (status === 'end')
                    ),
                }),
            ),
            D.Section({
                style: {
                    marginTop: '1em',
                },
            },
                h('input', {
                    id: 'submit',
                    type: 'submit',
                    class: D.BUTTON_CLASS,
                    value: $status.map(
                        status => submitTextMap.get(status)
                    ),
                }),
            ),
        ),
    )
);
