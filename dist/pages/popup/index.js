import { r as reactDom, a as react } from '../../chunks/index-97a7893b.js';

const App = () => {
    const [toggleOpen, setToggleOpen] = react.useState(false);
    const bookmarkPage = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            chrome.bookmarks.create({ title: tab.title, url: tab.url });
            setToggleOpen(true);
        });
    };
    const openBookmarks = () => {
        chrome.tabs.create({
            url: 'chrome://bookmarks',
        });
    };
    return (react.createElement("div", { className: "w-[300px] h-[300px] flex items-center justify-center" },
        react.createElement("button", { className: "px-3 py-2 bg-green-600 text-white rounded-md", onClick: bookmarkPage }, "Bookmark Page"),
        toggleOpen && (react.createElement("button", { onClick: openBookmarks, className: "ml-2 px-3 py-2 bg-[rgba(0,0,0,0.65)] text-white rounded-md" }, "Open Bookmarks"))));
};

const root = document.querySelector('#root');
reactDom.render(react.createElement(App, null), root);
