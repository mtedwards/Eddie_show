<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _eddie
 */

?>

	</div><!-- #content -->

	<footer id="colophon" class="site-footer">
		<?php
			_ed_unsplash(1000,600);

			_ed_unsplash(1000,600);

			_ed_unsplash(1000,600);
		?>
		<div class="site-info">
			<a href="<?php echo esc_url( __( 'https://wordpress.org/', '_eddie' ) ); ?>"><?php
				/* translators: %s: CMS name, i.e. WordPress. */
				printf( esc_html__( 'Proudly powered by %s', '_eddie' ), 'WordPress' );
			?></a>
			<span class="sep"> | </span>
			<?php
				/* translators: 1: Theme name, 2: Theme author. */
				printf( esc_html__( 'Theme: %1$s by %2$s.', '_eddie' ), '_eddie', '<a href="https://automattic.com/">Automattic</a>' );
			?>
		</div><!-- .site-info -->
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
