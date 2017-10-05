<?php
  $images = get_field('gallery');

  if($images) { ?>
    <div class="content-grid">
      <?php foreach($images as $image) { ?>
        <div class="grid__item">
          <a href="<?php echo $image['sizes']['large']; ?>" data-fancybox="group" data-caption="<?php echo $image['caption']; ?>">
            <img src="<?php echo $image['sizes']['gallery-thumb']; ?>" alt="<?php echo $image['alt']; ?>">
          </a>
        </div>
      <?php } // end foreach ?>
    </div>
  <?php } else { ?>
    <h3>Oops, the gallery appears to be empty.</h3>
  <?php } // end if images  ?>
