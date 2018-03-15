<?php
  $people = get_field('people');

  if($people) { $i = 1; ?>
    <div class="people-list" id="people-list">
      <?php foreach($people as $person) { $personID = 'person-'.$i; ?>
        <div class="people__item grid__item">
          <div class="ppl-heading">
          <?php if($person['photo']) { ?>
            <a data-fancybox data-src="<?php echo '#'.$personID; ?>" href="javascript:;">
              <img class="alignleft" src="<?php echo $person['photo']['sizes']['headshot-square']; ?>" alt="<?php echo $person['photo']['alt']; ?>">
            </a>
          <?php } ?>

            <h4><?php echo $person['name']; ?></h4>
            <p><i><?php echo $person['position']; ?></i></p>
          </div>
          <div class="popup" style="display: none;" id="<?php echo $personID; ?>">
  					<h4><?php echo $person['name']; ?> - <i><?php echo $person['position']; ?></i></h4>

            <img class="alignleft" src="<?php echo $person['photo']['sizes']['medium']; ?>" alt="<?php echo $person['photo']['alt']; ?>">
  			    <?php echo $person['bio']; ?>
  				</div>
        </div>
      <?php
        $i++;
        } // end foreach ?>
    </div>
  <?php } else { ?>
    <h3>Oops, There don't seem to be any people.</h3>
  <?php } // end if people  ?>
</hr>
