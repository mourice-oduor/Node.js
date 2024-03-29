const express               = require("express"),
      router                = express.Router(),
      Campground            = require("../models/campground"),
      campgrounds           = require('../controllers/campgrounds');
      catchAsync            = require('../utils/catchAsync'),
      { isLoggedIn, isAuthor, validateCampground } = require('../middleware'),
      multer                = require('multer'),
      { storage }           = require('../cloudinary'),
      upload                = multer({ storage });


//NOTE - THE ORDER OF THESE ROUTES MATTERS A LOT!!!!
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))


router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;