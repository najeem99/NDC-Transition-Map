// This GoJS sample was designed by Synergy Codes, our consultant partner with
// over a decade of experience and cooperation with the GoJS team.
// See https://synergycodes.com/gojs/ for more

// This sample demonstrates polished Node and Link template design,
// which involves considerable code and opinionated choices.
// It may be unsuitable as a starting point unless you want to copy these specific styles.
// As part of your evaluation, the GoJS team is happy to help you craft your own templates.
// For a more rudimentary family tree, see familyTreeJP.html

// properties used in bindings,
// defined to not use simple strings in bindings across application
const nameProperty = 'name';
const genderProperty = 'gender';
const statusProperty = 'status';
const countProperty = 'count';

const theme = {
    colors: {
        femaleBadgeBackground: '#FFCBEA',
        maleBadgeBackground: '#A2DAFF',
        femaleBadgeText: '#7A005E',
        maleBadgeText: '#001C76',
        kingQueenBorder: '#FEBA00',
        princePrincessBorder: '#679DDA',
        civilianBorder: '#58ADA7',
        personText: '#383838',
        personNodeBackground: '#FFFFFF',
        selectionStroke: '#485670',
        counterBackground: '#485670',
        counterBorder: '#FFFFFF',
        counterText: '#FFFFFF',
        link: '#686E76'
    },
    fonts: {
        badgeFont: 'bold 12px Poppins',
        birthDeathFont: '14px Poppins',
        nameFont: '500 18px Poppins',
        counterFont: '14px Poppins'
    }
};

// toggle highlight on mouse enter/leave
// this sample also uses highlight for selection, so only unhighlight if unselected
const onMouseEnterPart = (e, part) => part.isHighlighted = true;
const onMouseLeavePart = (e, part) => { if (!part.isSelected) part.isHighlighted = false; }
const onSelectionChange = (part) => { part.isHighlighted = part.isSelected; }

const STROKE_WIDTH = 3;
const ADORNMENT_STROKE_WIDTH = STROKE_WIDTH + 1;
const CORNER_ROUNDNESS = 12;
const IMAGE_TOP_MARGIN = 20;
const MAIN_SHAPE_NAME = 'mainShape';
const IMAGE_DIAMETER = 40;

const getStrokeForStatus = (status) => {
    switch (status) {
        case 'king':
        case 'queen':
            return theme.colors.kingQueenBorder;
        case 'prince':
        case 'princess':
            return theme.colors.princePrincessBorder;
        case 'civilian':
        default:
            return theme.colors.civilianBorder;
    }
};

function strokeStyle(shape) {
    return shape
        .set({
            fill: theme.colors.personNodeBackground,
            strokeWidth: STROKE_WIDTH
        })
        .bind('stroke', statusProperty, status => getStrokeForStatus(status))
        .bindObject('stroke', 'isHighlighted', (isHighlighted, obj) =>
            isHighlighted
                ? theme.colors.selectionStroke
                : getStrokeForStatus(obj.part.data.status))
}

function getScreenByStepParam(stepParam, regKeys) {
    if (!stepParam || stepParam.length < 3) return null;

    const screenId = stepParam.slice(0, 3); // Extract first 3 characters

    return regKeys.find(
        item => item.type === "screen" && item.screenId === screenId
    ) || null;
}
function extractVisibleText(rawString) {
    if (!rawString) return "";

    // Replace \\ with \
    let str = rawString.replace(/\\\\/g, "\\");

    // Remove specific known control codes
    str = str
        .replace(/\\1b\[[^\]]*m/g, '')          // ANSI escape codes
        .replace(/\\1b\(.|\\1b[@=]?/g, '')       // \1b(1 or \1b@ \1b=
        .replace(/\\0[cdefhlmnprstuvxz]/gi, '')  // \0f, \0c, etc
        .replace(/\\0e[0-9a-zA-Z]+/gi, '')       // \0e190
        .replace(/\\0[0-9a-zA-Z]+/gi, '')        // any \0 followed by chars
        .replace(/\\1b/g, '')                    // leftover \1b
        .replace(/\\./g, '')                     // other unknown escapes
        .replace(/^[0-9A-Z@=]+/, '')             // remove leading noise (like 1AE or 1190@=B01)
        .replace(/\s+/g, ' ')                    // multiple spaces to one
        .trim();

    // console.log('extractVisibleText:', str);
    return str;
}




// Panel to display the number of children a node has
const linkCountBatch = () =>
    new go.Panel('Auto', {
        visible: false,
        alignmentFocus: go.Spot.Center,
        alignment: go.Spot.Bottom
    })
        .bindObject('visible', '', (obj) => obj.findLinksOutOf().count > 0)
        .add(
            new go.Shape('Circle', {
                desiredSize: new go.Size(29, 29),
                strokeWidth: STROKE_WIDTH,
                stroke: theme.colors.counterBorder,
                fill: theme.colors.counterBackground
            }),
            new go.TextBlock({
                alignment: new go.Spot(0.5, 0.5, 0, 1),
                stroke: theme.colors.counterText,
                font: theme.fonts.counterFont,
                textAlign: 'center'
            })
                .bindObject('text', '', (obj) => {

                    console.log('linkCountBatch', obj.findLinksOutOf())
                    return obj.findLinksOutOf().count
                })
        )


const screenBlock = () =>
    new go.Panel("Auto")
        .add(
            new go.Shape("RoundedRectangle", {
                fill: "#f0f0f0",
                strokeWidth: 1
            }).bind("stroke", "type", function (t) {
                return "#ccc";
            }),

            new go.Panel("Vertical").add(
                // Screen ID label (outside the box)
                new go.TextBlock({
                    margin: new go.Margin(0, 0, 4, 0), // space below the label
                    stroke: "limegreen",               // green text color (bright like ATM)
                    font: "bold 10pt monospace",       // bold + monospace for terminal feel
                    textAlign: "center"
                }).bind("text", "", function (data) {
                    const datumm = getScreenByStepParam(data.STEP_PARAM, regKeys);
                    return ` ${datumm.screenId || ' '}`;
                }),
                // ATM-style box with contents
                new go.Panel("Auto").add(
                    new go.Shape("Rectangle", {
                        fill: "black",
                        stroke: "black",
                        strokeWidth: 1
                    }),
                    new go.TextBlock({
                        margin: 8,
                        font: "bold 8pt monospace",
                        stroke: "white",
                        wrap: go.TextBlock.WrapFit,
                        width: 200,
                        lineSpacing: 4,
                        isMultiline: true,
                        textAlign: "left"
                    }).bind("text", "", function (data) {
                        const screenData = getScreenByStepParam(data.STEP_PARAM, regKeys);
                        return ` ${extractVisibleText(screenData?.CONTENTS) || ' '}`;
                    })
                )
            )

        );

const stepFuncBlock = () => new go.TextBlock({
    margin: 2,
    font: '10pt monospace',
    stroke: '#007acc'
}).bind('text', 'STEP_FUNC').bind('visible', 'type', t => t === 'state');

const stepParamBlock = () =>
    new go.TextBlock({
        margin: new go.Margin(5, 2, 2, 2), // top, right, bottom, left
        marginTop: 10,
        font: '9pt monospace',
        stroke: '#999'
    })
        .bind('text', 'STEP_PARAM', function (param) {
            if (!param) return '';
            if (param.length < 24) {
                return param.padEnd(24, 'x').match(/.{1,3}/g).join(' ');
            }
            return param.match(/.{1,3}/g).join(' ');
        })
        .bind('stroke', 'STEP_PARAM', function (param) {
            return param && param.length < 24 ? 'red' : '#999';
        })
        .bind('visible', 'type', t => t === 'state');

const createNodeTemplate = () =>
    new go.Node('Auto', {
        selectionAdorned: false,
        mouseEnter: onMouseEnterPart,
        mouseLeave: onMouseLeavePart,
        selectionChanged: onSelectionChange
    }).add(
        new go.Shape('RoundedRectangle', {
            fill: '#f0f0f0',
            strokeWidth: 2
        }).bind('stroke', 'type', function (t) {
            return t === 'state' ? 'orange' : t === 'screen' ? 'green' : '#ccc';
        }),

        new go.Panel('Vertical')
            .add(
                new go.TextBlock({
                    margin: 4,
                    font: 'bold 12pt sans-serif',
                    stroke: '#333'
                })
                    .bind('text', '', function (data) {
                        return `${data.type.toUpperCase()} -  ${data.screenId || ''}`;
                    }),

                stepFuncBlock(),

                screenBlock().bind('visible', 'STEP_FUNC', t => !skipScreens_STEP_FUNC.includes(t)),
                stepParamBlock(),
                // linkCountBatch(),

            )
    ).bind("visible", "type", t => t === "state"); // 👈 Only visible for 'state'



const createLinkTemplate = () => {
    return new go.Link({
        selectionAdorned: false,
        routing: go.Routing.Orthogonal,
        layerName: 'Background',
        mouseEnter: onMouseEnterPart,
        mouseLeave: onMouseLeavePart
    })
        .add(
            new go.Shape({
                strokeWidth: 2
            }).bind("stroke", "color")
        )
        .bind("stroke", "color", (c) => c || "#999")
        .add(
            new go.TextBlock({
                font: '8pt monospace',
                segmentOffset: new go.Point(0, -10),
                stroke: '#555'
            })
                .bind('text', 'text')
                .bind('stroke', 'color', (c) => c || "#555")
        )
        .bind(new go.Binding("segmentOffset", "linkIndex", idx => {
            // idx is your link's index, shift vertically by 5px times index
            if (idx == null) return new go.Point(0, 0);
            return new go.Point(0, idx * 5);
        }));
};

const initDiagram = (divId) => {
    const diagram = new go.Diagram(divId, {
        layout: new go.TreeLayout({
            angle: 90,
            nodeSpacing: 20,
            layerSpacing: 50,
            layerStyle: go.TreeLayout.LayerUniform,

            // For compaction, make the last parents place their children in a bus
            treeStyle: go.TreeStyle.LastParents,
            alternateAngle: 90,
            alternateLayerSpacing: 35,
            alternateAlignment: go.TreeAlignment.BottomRightBus,
            alternateNodeSpacing: 20
        }),
        'toolManager.hoverDelay': 100,
        linkTemplate: createLinkTemplate(),
        model: new go.TreeModel({ nodeKeyProperty: 'name' })
    });

    diagram.nodeTemplate = createNodeTemplate();
    // const nodes = familyData;
    const nodes = regKeys;
    // diagram.model.addNodeDataCollection(nodes);
    const model = new go.GraphLinksModel();
    model.nodeKeyProperty = "name";      // use 'name' as unique node identifier
    model.linkFromKeyProperty = "from";  // links must have a 'from'
    model.linkToKeyProperty = "to";      // and a 'to'
    model.nodeDataArray = regKeys;       // your nodes
    model.linkDataArray = links;         // your links

    diagram.model = model;

    console.log('nodeDataArray:', diagram.model.nodeDataArray);
    console.log('nodeDataArray links:', links);

    // Initially center on root:
    diagram.addDiagramListener('InitialLayoutCompleted', () => {
        const root = diagram.findNodeForKey('King George V');
        if (!root) return;
        diagram.scale = 0.6;
        diagram.scrollToRect(root.actualBounds);
    });

    // Setup zoom to fit button
    document.getElementById('zoomToFit').addEventListener('click', () => diagram.commandHandler.zoomToFit());

    document.getElementById('centerRoot').addEventListener('click', () => {
        diagram.scale = 1;
        diagram.commandHandler.scrollToPart(diagram.findNodeForKey('King George V'));
    });
};
let regKeys = [

    {
        "type": "state",
        "screenId": "SAM",
        "STEP_FUNC": "DC_INFORMATION_ENTRY",
        "STEP_PARAM": "SCN141137BP5SAMBP1137123"
    },
    {
        "type": "screen",
        "screenId": "SCN",
        "CONTENTS": "\\\\1b(1\\\\0c\\\\0fAEPLEASE ENTER ACCOUNT NUMBER"
    },
];
const links = [];

const linkRules = [
    {
        matchSourceFunc: 'NDC_FDK_SELECT8',
        matchTargetFunc: 'NDC_FDK_SWITCH',
        matchSourceParamChunk: 4,
        color: '#9b59b6',
        label: 'extension'

    },
    {
        matchSourceFunc: 'NDC_FDK_SELECT8',
        matchTargetFunc: 'NDC_EXT',
        matchSourceParamChunk: 5,
        color: '#9b59b6',
        label: 'extension'

    },
    {
        matchSourceFunc: 'NDC_FDK_SWITCH',
        matchTargetFunc: null,
        matchSourceParamChunk: 1,
        color: '#0d9f00',
        label: 'FDK A'
    },
    {
        matchSourceFunc: 'NDC_FDK_SWITCH',
        matchTargetFunc: null,
        matchSourceParamChunk: 2,
        color: '#0d9f00',
        label: 'FDK B'
    },
    {
        matchSourceFunc: 'NDC_FDK_SWITCH',
        matchTargetFunc: null,
        matchSourceParamChunk: 3,
        color: '#0d9f00',
        label: 'FDK C'
    },
    {
        matchSourceFunc: 'NDC_FDK_SWITCH',
        matchTargetFunc: null,
        matchSourceParamChunk: 4,
        color: '#0d9f00',
        label: 'FDK D'
    },
    {
        matchSourceFunc: 'NDC_FDK_SWITCH',
        matchTargetFunc: null,
        matchSourceParamChunk: 5,
        color: '#0d9f00',
        label: 'FDK F'
    },
    {
        matchSourceFunc: 'NDC_FDK_SWITCH',
        matchTargetFunc: null,
        matchSourceParamChunk: 6,
        color: '#0d9f00',
        label: 'FDK G'
    },
    {
        matchSourceFunc: 'NDC_FDK_SWITCH',
        matchTargetFunc: null,
        matchSourceParamChunk: 7,
        color: '#0d9f00',
        label: 'FDK H'
    },
    {
        matchSourceFunc: 'NDC_FDK_SWITCH',
        matchTargetFunc: null,
        matchSourceParamChunk: 7,
        color: '#0d9f00',
        label: 'FDK I'
    },
    {
        matchSourceFunc: 'DC_FDK_SELECT4',
        matchTargetFunc: null,
        matchSourceParamChunk: 4,
        color: '#91eb00',
        label: 'FDK A'
    },
    {
        matchSourceFunc: 'DC_FDK_SELECT4',
        matchTargetFunc: null,
        matchSourceParamChunk: 5,
        color: '#91eb00',
        label: 'FDK B'
    },
    {
        matchSourceFunc: 'DC_FDK_SELECT4',
        matchTargetFunc: null,
        matchSourceParamChunk: 6,
        color: '#91eb00',
        label: 'FDK C'
    },
    {
        matchSourceFunc: 'DC_FDK_SELECT4',
        matchTargetFunc: null,
        matchSourceParamChunk: 7,
        color: '#91eb00',
        label: 'FDK D'
    },
];
const skipScreens_STEP_FUNC = ['NDC_FDK_SWITCH', 'NDC_EXT'];


window.addEventListener('DOMContentLoaded', () => {
    // setTimeout only to ensure font is loaded before loading diagram
    // you may want to use an asset loading library for this
    // to keep this sample simple, it does not
    setTimeout(() => {
        const statesRaw = localStorage.getItem('states');
        getLastEdited();
        if (statesRaw) {
            regKeys = JSON.parse(statesRaw);
        }

        regKeys = regKeys.map(node => ({
            ...node,
            name: (node.type || '') + '_' + (node.screenId || '')  // fallback if any field missing
        }));

        checkLinking()




        initDiagram('myDiagramDiv');
    }, 300);
});

function getLastEdited() {
    const lastEditedRaw = localStorage.getItem('lastEdited');
    const lastEditedDate = lastEditedRaw ? new Date(lastEditedRaw) : null;

    if (lastEditedDate) {
        document.getElementById('lastEditedDisplay').textContent =
            lastEditedDate.toLocaleString(); // You can customize this format if needed
    } else {
        document.getElementById('lastEditedDisplay').textContent = 'Not Available';
    }

}
function getStepParamChunk(stepParam, position) {
    if (!stepParam || position < 1 || position > 8) return null;

    const startIndex = (position - 1) * 3;
    return stepParam.substring(startIndex, startIndex + 3);
}

function checkLinking() {

    linkRules.forEach(rule => {
        regKeys.forEach(sourceNode => {
            if (sourceNode.STEP_FUNC === rule.matchSourceFunc) {
                regKeys.forEach(targetNode => {
                    if (
                        (!rule.matchTargetFunc || targetNode.STEP_FUNC === rule.matchTargetFunc) &&
                        getStepParamChunk(sourceNode.STEP_PARAM, rule.matchSourceParamChunk) === targetNode.screenId
                    ) {
                        links.push({
                            from: sourceNode.name,
                            to: targetNode.name,
                            color: rule?.color,
                            text: rule.label || ''
                        });
                    }
                });
            }
        });
    });

}
function showPopup() {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}
function hidePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

