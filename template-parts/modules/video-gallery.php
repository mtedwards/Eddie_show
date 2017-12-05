<?php
  $videos = get_field('videos');

  if($videos) { ?>
    <div class="content-grid large-2 video-gallery">
      <?php foreach($videos as $video) {
        $videoDetails = get_video($video['video_url']);
      ?>
        <div class="grid__item">
          <a data-fancybox href="<?php echo $videoDetails['video']; ?>" style="background-image:url('<?php echo $videoDetails['image']; ?>');">
            <p><?php echo $video['video_title']; ?></p>
          </a>
        </div>
      <?php } // end foreach ?>
    </div>
  <?php } else { ?>
    <h3>Oops, the gallery appears to be empty.</h3>
  <?php } // end if images  ?>
