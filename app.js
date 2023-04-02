const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

// main page
app.get('/', (req, res) => {
    res.render('blog-main')
})

// Blogs page route
app.get('/blog-list', (req, res) => {
    fs.readFile('./data/data.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        res.render('blog-list', { blogs: blogs })
    })
})

// Blog detail route
app.get('/blog-list/:id', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/data.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        const blog = blogs.filter(blog => blog.id === id)[0]

        res.render('blog-details', { blog: blog })
    })
})

// Create route
app.get('/create', (req, res) => {
    res.render('blog-create')
})

app.post('/create', (req, res) => {
    const blogTitle = req.body.blogTitle
    const blogDesc = req.body.blogDesc
    const blogText = req.body.blogText

    if (blogTitle.trim() === '' && blogDesc.trim() === '' && blogText.trim() === '') {
        res.render('blog-create', { error: true })
    } else {
        fs.readFile('./data/data.json', (err, data) => {
            if (err) throw err

            const blogs = JSON.parse(data)

            blogs.push({
                id: id(),
                blogTitle: blogTitle,
                blogDesc: blogDesc,
                blogText: blogText,
            })

            fs.writeFile('./data/data.json', JSON.stringify(blogs), err => {
                if (err) throw err

                res.render('blog-create', { success: true })
            })
        })
    }
})

// Edit route
app.get('/blog-list/:id/edit', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/data.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        const blog = blogs.filter(blog => blog.id === id)[0]

        res.render('blog-edit', { blog: blog })
    })
})

app.post('/blog-list/:id/edit', (req, res) => {
    const id = req.params.id

    const blogTitle = req.body.blogTitle
    const blogDesc = req.body.blogDesc
    const blogText = req.body.blogText

    if (blogTitle.trim() === '' && blogDesc.trim() === '' && blogText.trim() === '') {
        res.render('blog-edit', { error: true })
    } else {
        fs.readFile('./data/data.json', (err, data) => {
            if (err) throw err

            const blogs = JSON.parse(data)

            const filterBlog = blogs.map(blog => {
                if (blog.id === id) {
                    return {
                        id: blog.id,
                        blogTitle: blogTitle,
                        blogDesc: blogDesc,
                        blogText: blogText,
                    }
                }
                return blog
            })

            fs.writeFile('./data/data.json', JSON.stringify(filterBlog), err => {
                if (err) throw err

                res.render('blog-edit', { success: true, blog: filterBlog.filter(blog => blog.id === id)[0] })
            })
        })
    }
})

app.get('/blog-list/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/data.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        const filterBlog = blogs.filter(blog => blog.id !== id)

        fs.writeFile('./data/data.json', JSON.stringify(filterBlog), err => {
            if (err) throw err

            res.render('/blog-list', { blogs: filterBlog, deleted: true })
        })
    })
})

app.get('/api/vp1/blog-list', (req, res) => {
    fs.readFile('./data/data.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        res.json(blogs)
    })
})

app.listen(8000, err => {
    if (err) console.log(err)
    console.log('Server is running on port 8000...')
})

function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}