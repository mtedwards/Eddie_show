<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _eddie
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">

			<?php the_post(); ?>

			<?php
				$cities = get_field('city','ticket_details');
				if($cities) { ?>
					<div class="cities">
						<?php foreach($cities as $city) {?>

							<div class="single-city">
          <div class="city-header">
            <h2><?php echo $city['title']; ?></h2>
          </div>
          <div class="city-details">

						<?php
              $dates = $city['dates'];
              if($dates) {
                echo '<h3>Dates</h3>';
                echo '<p>'.$dates.'</p>';
              }
            ?>

						<?php
              $booking_url = $city['booking_url'];
              if($booking_url) {?>
                <a href="<?php echo $booking_url; ?>" class="button">BOOK NOW</a>
            <?php  } ?>

            <?php
              $venue = $city['venue'];
              if($venue) {
                echo '<h3>Venue</h3>';
                echo '<p>'.$venue.'</p>';
              }
            ?>

						<?php
              $price = $city['price'];
              if($price) {
                echo '<h3>Price</h3>';
                echo '<p>'.$price.'</p>';
              }
            ?>

            <?php
              $performances = $city['performances'];
              if($performances) {
                echo '<h3>Performances</h3>';
                echo '<p>'.$performances.'</p>';
              }
            ?>

            <?php
              $running_time = $city['running_time'];
              if($running_time) {
                echo '<h3>Running Time</h3>';
                echo '<p>'.$running_time.'</p>';
              }
            ?>
          </div>

        </div>

						<?php } // end foreach city ?>
					</div>
				<?php
				} // end if $cities
			 ?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
// get_sidebar();
get_footer();
