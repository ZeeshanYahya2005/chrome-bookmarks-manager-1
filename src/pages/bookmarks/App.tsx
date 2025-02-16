import React, { useEffect, useState } from 'react'

const App = (): JSX.Element => {
  const [bookmarkTree, setBookmarkTree] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([])
  const [searchResults, setSearchResults] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([])
  const [recentBookmarkResults, setRecentBookmarkResults] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
    >([])

  useEffect(() => {
    fetchBookmarks()
  }, [])

  useEffect(() => {
    fetchRecentBookmarks()
  })

  const fetchBookmarks = () => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      const bookmarkTree = bookmarkTreeNodes[0].children
      setBookmarkTree(bookmarkTree ? bookmarkTree : [])
    })
  }
  
  const searchBookmarks = (keyword: string) => {
    chrome.bookmarks.search(keyword, (results) => {
      setSearchResults(results)
    })
  }

  const fetchRecentBookmarks = () => {
    chrome.bookmarks.getRecent(20, (results) => {
      setRecentBookmarkResults(results)
    })
  }

  const calculateIndent = (level: number) => {
    return level * 15
  }

  const createBookmarkFolder = (parentId?: string) => {
    const folderName = prompt('What do you want to name the folder?')
    if (folderName) {
      if (parentId) {
        chrome.bookmarks.create({
          parentId: parentId,
          title: folderName,
        })
      } else {
        chrome.bookmarks.create({
          title: folderName,
        })
      }
      fetchBookmarks()
      return true
    }
    return false
  }

  const renderBookmarks = (
    tree: chrome.bookmarks.BookmarkTreeNode[],
    level = 0
  ) => {
    return tree.map((treeItem) => {
      if (treeItem.children) {
        // folder

        return (
          <li
            key={treeItem.id}
            style={{
              paddingLeft: calculateIndent(level),
            }}
          >
            <span
              onClick={(e) => {
                const childUl = document.getElementById(treeItem.id)
                const targetElement = e.target as HTMLElement
                if (childUl) {
                  childUl.classList.toggle('hidden')
                  childUl.classList.toggle('flex')
                  if (childUl.classList.contains('flex')) {
                    targetElement.innerText = `📂 ${treeItem.title}`
                  } else {
                    targetElement.innerText = `⮕📁 ${treeItem.title}`
                  }
                }
              }}
              className="flex py-2 pr-2 cursor-pointer font-bold border-b text-sm hover:font-bold"
            >
              ⮕📁 {treeItem.title}
            </span>

            <ul id={treeItem.id} className="hidden flex-col">
              {renderBookmarks(treeItem.children, level + 1)}

            <div //div for creating new folder
            className="flex py-2 pr-2 text-base font-sembold bg-grey-100 hover:bg-blue-100 cursor-pointer over:font-bold"
            onClick={() => {
              if (createBookmarkFolder(treeItem.id)) {
                alert("folder created!")
              }
            }}>➕ New Folder?</div>
            </ul>
          </li>
        )
      } else {
        // link
        return (
          <li key={treeItem.id}>
            <a
              href={treeItem.url}
              target="_blank"
              style={{
                paddingLeft: calculateIndent(level),
              }}
              className="flex py-2 pr-2 bg-grey-100 hover:bg-blue-100 cursor-pointer"
            >
              <img
                src={
                  'https://www.google.com/s2/favicons?domain=' + treeItem.url
                }
                className="w-4 h-4 mr-2"
              />
              {treeItem.title}
            </a>
          </li>
        )
      }
    })
  }

  const renderRecentBookmarks = (tree: chrome.bookmarks.BookmarkTreeNode[]) => {
    return tree.map((treeItem) => {
      //...change to loop through recent bookmarks
        return (<li key={treeItem.id}>
          <a href={treeItem.url} target="_blank" className="flex py-2 pr-2 bg-grey-100 hover:bg-blue-100 cursor-pointer">
            <img className='w-4 h-4 mr-2' src={'https://www.google.com/s2/favicons?domain=' + treeItem.url}></img>
            {treeItem.title}
          </a>
        </li>
        )
    })
  }

  return (
    <div className="flex flex-row text-slate-700 justify-evenly bg-slate-100 pt-4">
      {/* side bar */}
      <div className="w-[500px] min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>
        <ul>{renderBookmarks(bookmarkTree)}</ul>
      </div>

      {/* search bar */}
      <div className="w-[500px] min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <input
          onChange={(e) => searchBookmarks(e.target.value)}
          placeholder="Search your bookmarks"
          className="w-full text-slate-700 px-3 py-3 bg-slate-200 rounded-lg font-bold text-base"
        />
        <ul className="mt-2">{renderBookmarks(searchResults)}</ul>
      </div>
            {/* recent bookmarks bar */}
            <div className="w-[500px] min-h-screen"><h1 className="text-2xl font-bold mb-4">Recent Bookmarks</h1>
      <ul>
          {renderRecentBookmarks(recentBookmarkResults)}
      </ul>

      </div>
    </div>
  )
}

export default App
