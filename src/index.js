const appState = {
    title: {
        text: 'React.js 小书',
        color: 'red',
    },
    content: {
        text: 'React.js 小书内容',
        color: 'blue'
    }
}

function stateChanger (state, action) {
    switch (action.type) {
        case 'UPDATE_TITLE_TEXT':
            return { // 构建新的对象并且返回
                ...state,
                title: {
                    ...state.title,
                    text: action.text
                }
            }
        case 'UPDATE_TITLE_COLOR':
            return { // 构建新的对象并且返回
                ...state,
                title: {
                    ...state.title,
                    color: action.color
                }
            }
        default:
            return state
    }
}

function createStore (state, stateChanger) {
    //定义一个数组
    const listeners = []
    //定义一个方法:通过store.subscribe(listener)调用,给subscribe传入一个监听函数,同时它会被push到listeners数组中
    const subscribe = (listener)=> listeners.push(listener)
    const getState = () => state
    //每次被调用时:1.调用stateChanger修改数据. 2.遍历listener数组里的函数并分别调用
    const dispatch = (action) => {
        state = stateChanger(state, action) // 覆盖原对象
        listeners.forEach((listener)=>listener())
    }
    return { getState, dispatch, subscribe }
}

function renderApp (newAppState, oldAppState={}) {  // 防止 oldAppState 没有传入
    if(newAppState === oldAppState) return  // 数据没有变化就不渲染了
    console.log('render app...')
    renderTitle(newAppState.title, oldAppState.title)
    renderContent(newAppState.content, oldAppState.content)
}

function renderTitle (newTitle, oldTitle={}) {
    if (newTitle === oldTitle) return // 数据没有变化就不渲染了
    console.log('render title...')
    const titleDOM = document.getElementById('title')
    titleDOM.innerHTML = newTitle.text
    titleDOM.style.color = oldTitle.color
}

function renderContent (newContent, oldContent={}) {
    if (newContent === oldContent) return // 数据没有变化就不渲染了
    console.log('render content...')
    const contentDOM = document.getElementById('content')
    contentDOM.innerHTML = newContent.text
    contentDOM.style.color = newContent.color
}

const store = createStore(appState, stateChanger)
let oldState = store.getState() // 缓存旧的 state
store.subscribe(()=> {
    const newState = store.getState() // 数据可能变化，获取新的 state
    renderApp(newState, oldState) // 把新旧的 state 传进去渲染
    oldState = newState    // 渲染完以后，新的 newState 变成了旧的 oldState，等待下一次数据变化重新渲染
})

renderApp(store.getState())
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色