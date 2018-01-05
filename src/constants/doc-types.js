export default {
  book: {
    "type":"Book",
    "packages": "playing-book-elements",
    "facets":[
      "Folderish",
      "Versionable",
      "Publishable",
      "Commentable",
      "HasRelatedText",
      "Tagable",
      "Downloadable"
    ],
    "subtypes": ['chapter']
  },
  chapter: {
    "type":"Chapter",
    "packages": "playing-book-elements",
    "facets":[
      "Versionable",
      "Publishable",
      "Commentable",
      "HasRelatedText",
      "Tagable",
      "Downloadable"
    ]
  }
};