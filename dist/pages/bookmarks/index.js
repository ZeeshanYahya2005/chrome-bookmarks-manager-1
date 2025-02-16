import { r as reactDom, a as react } from '../../chunks/index-97a7893b.js';

const App = () => {
    const [bookmarkTree, setBookmarkTree] = react.useState([]);
    const [searchResults, setSearchResults] = react.useState([]);
    const [recentBookmarkResults, setRecentBookmarkResults] = react.useState([]);
    react.useEffect(() => {
        fetchBookmarks();
    }, []);
    react.useEffect(() => {
        fetchRecentBookmarks();
    });
    const fetchBookmarks = () => {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            const bookmarkTree = bookmarkTreeNodes[0].children;
            setBookmarkTree(bookmarkTree ? bookmarkTree : []);
        });
    };
    const searchBookmarks = (keyword) => {
        chrome.bookmarks.search(keyword, (results) => {
            setSearchResults(results);
        });
    };
    const fetchRecentBookmarks = () => {
        chrome.bookmarks.getRecent(20, (results) => {
            setRecentBookmarkResults(results);
        });
    };
    const calculateIndent = (level) => {
        return level * 15;
    };
    const createBookmarkFolder = (parentId) => {
        const folderName = prompt('What do you want to name the folder?');
        if (folderName) {
            if (parentId) {
                chrome.bookmarks.create({
                    parentId: parentId,
                    title: folderName,
                });
            }
            else {
                chrome.bookmarks.create({
                    title: folderName,
                });
            }
            fetchBookmarks();
            return true;
        }
        return false;
    };
    const renderBookmarks = (tree, level = 0) => {
        return tree.map((treeItem) => {
            if (treeItem.children) {
                // folder
                return (react.createElement("li", { key: treeItem.id, style: {
                        paddingLeft: calculateIndent(level),
                    } },
                    react.createElement("span", { onClick: (e) => {
                            const childUl = document.getElementById(treeItem.id);
                            const targetElement = e.target;
                            if (childUl) {
                                childUl.classList.toggle('hidden');
                                childUl.classList.toggle('flex');
                                if (childUl.classList.contains('flex')) {
                                    targetElement.innerText = `📂 ${treeItem.title}`;
                                }
                                else {
                                    targetElement.innerText = `⮕📁 ${treeItem.title}`;
                                }
                            }
                        }, className: "flex py-2 pr-2 cursor-pointer font-bold border-b text-sm hover:font-bold" },
                        "\u2B95\uD83D\uDCC1 ",
                        treeItem.title),
                    react.createElement("ul", { id: treeItem.id, className: "hidden flex-col" },
                        renderBookmarks(treeItem.children, level + 1),
                        react.createElement("div", { className: "flex py-2 pr-2 text-base font-sembold bg-grey-100 hover:bg-blue-100 cursor-pointer over:font-bold", onClick: () => {
                                if (createBookmarkFolder(treeItem.id)) {
                                    alert("folder created!");
                                }
                            } }, "\u2795 New Folder?"))));
            }
            else {
                // link
                return (react.createElement("li", { key: treeItem.id },
                    react.createElement("a", { href: treeItem.url, target: "_blank", style: {
                            paddingLeft: calculateIndent(level),
                        }, className: "flex py-2 pr-2 bg-grey-100 hover:bg-blue-100 cursor-pointer" },
                        react.createElement("img", { src: 'https://www.google.com/s2/favicons?domain=' + treeItem.url, className: "w-4 h-4 mr-2" }),
                        treeItem.title)));
            }
        });
    };
    const renderRecentBookmarks = (tree) => {
        return tree.map((treeItem) => {
            //...change to loop through recent bookmarks
            return (react.createElement("li", { key: treeItem.id },
                react.createElement("a", { href: treeItem.url, target: "_blank", className: "flex py-2 pr-2 bg-grey-100 hover:bg-blue-100 cursor-pointer" },
                    react.createElement("img", { className: 'w-4 h-4 mr-2', src: 'https://www.google.com/s2/favicons?domain=' + treeItem.url }),
                    treeItem.title)));
        });
    };
    return (react.createElement("div", { className: "flex flex-row text-slate-700 justify-evenly bg-slate-100 pt-4" },
        react.createElement("div", { className: "w-[500px] min-h-screen" },
            react.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Bookmarks"),
            react.createElement("ul", null, renderBookmarks(bookmarkTree))),
        react.createElement("div", { className: "w-[500px] min-h-screen" },
            react.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Search"),
            react.createElement("input", { onChange: (e) => searchBookmarks(e.target.value), placeholder: "Search your bookmarks", className: "w-full text-slate-700 px-3 py-3 bg-slate-200 rounded-lg font-bold text-base" }),
            react.createElement("ul", { className: "mt-2" }, renderBookmarks(searchResults))),
        react.createElement("div", { className: "w-[500px] min-h-screen" },
            react.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Recent Bookmarks"),
            react.createElement("ul", null, renderRecentBookmarks(recentBookmarkResults)))));
};

const root = document.querySelector('#root');
reactDom.render(react.createElement(App, null), root);
