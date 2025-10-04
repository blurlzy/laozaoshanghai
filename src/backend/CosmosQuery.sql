SELECT min(c.dateCreated) FROM c where c.authorId = '715077950824001536'
SELECT max(c.dateCreated) FROM c where c.authorId = '715077950824001536'

SELECT * FROM c WHERE CONTAINS(c.text, 'shanghai')
SELECT * FROM c WHERE CONTAINS(c.tweetId, '1476717624255938560')

--SELECT f.id, 
--       f.tweetId, 
--       ARRAY(SELECT DISTINCT VALUE c.fileName FROM c IN f.mediaItems WHERE c.fileName='FKloHA2VkAA0JfZ.jpg') as mediaItems
--FROM f

--SELECT *
--FROM c
--WHERE ARRAY_CONTAINS(c.mediaItems, { fileName: "FKloHA2VkAA0JfZ.jpg", type: "photo", previewUrl: null, url: "https://stlaoshanghaiprod.blob.core.windows.net/photos/FKloHA2VkAA0JfZ.jpg" })


--SELECT *
--FROM c
--WHERE ARRAY_CONTAINS(c.tags, '虹口' )

SELECT *
FROM c WHERE ARRAY_LENGTH (c.mediaItems) > 1
order by c.dateCreated desc

-- check if property exists
SELECT * FROM c where IS_DEFINED(c.contentType)